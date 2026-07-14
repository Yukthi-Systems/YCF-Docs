---
id: architecture
title: Architecture
sidebar_position: 3
---

# Architecture

## Folder structure

```text
cmd/
  server/             # main.go — wires config, DB, RabbitMQ, GMime, plugin chain, SMTP server
  healthcheck/        # standalone binary: checks the SMTP port, Postgres, RabbitMQ — used as the Docker HEALTHCHECK
internal/
  config/             # env-var config, every field has a default (see Configuration)
  db/                 # pgx pool setup
  eml/                # CGo binding to GMime — parsing, header/body modification
  model/              # Mail struct and the Result enum (CONTINUE/ACCEPT/REJECT/DEFER/DISCARD)
  pipeline/           # Handler.Handle — runs the plugin chain, recovers panics
  plugin/             # Plugin interface, name -> factory registry, PLUGINS env loader
  reinject/           # sends the (possibly modified) mail back out to Postfix, with retry
  server/             # go-smtp Backend/Session glue
  smtpclient/         # outbound SMTP client + retry helpers used elsewhere
  utils/              # small helpers: domain-from-email, slice ops, UUID generation
plugins/              # one package per policy, self-registering via init()
pkg/
  adminlogs/          # publishes admin-facing audit events to RabbitMQ
  logger/             # zerolog + lumberjack rotating file output
  mailattach/         # attachment extraction helpers
  rabbitmq/           # thin wrapper over amqp091-go
```

## Startup, in `main.go`

1. Load config, init logging, init GMime (`eml.Init()`).
2. Open a signal-aware context (`SIGINT`/`SIGTERM`).
3. Connect the Postgres pool and get a RabbitMQ client.
4. Build the plugin chain from the `PLUGINS` env var (`plugin.LoadFromEnv`).
5. Wire up `pipeline.Handler{Context, Plugins}` and hand it to the `go-smtp` server.
6. On a shutdown signal: stop accepting new connections, give the server 60 seconds to
   drain in-flight `DATA` commands, then close the Postgres pool and the RabbitMQ
   connection, in that order.

## The plugin pipeline

`pipeline.Handler.Handle` is short enough to read in full:

```go
func (h *Handler) Handle(mail *model.Mail) model.Result {
	for _, p := range h.Plugins {
		res := safeRun(p, h.Context, mail)
		if res != model.CONTINUE {
			return res
		}
	}
	return model.ACCEPT
}
```

Plugins run in the order given in the `PLUGINS` env var (a comma-separated list of
plugin names). Every plugin gets the same `plugin.Context` — a Postgres pool, a
RabbitMQ client, and the GMime-backed EML parser — plus a pointer to the same mutable
`model.Mail`. A plugin like `add_euid` or `add_caution` rewrites headers or the body in
place through the parser, and every plugin after it in the chain sees that change.

`safeRun` wraps each plugin call in a `recover()`. A panicking plugin becomes a `DEFER`
result, logged with the plugin name and the panic value attached — one broken plugin
can't take the whole SMTP session down, and a bug doesn't silently turn into either an
accepted or a dropped message.

The five `model.Result` values:

| Result | Effect |
|---|---|
| `CONTINUE` | Keep running the chain |
| `ACCEPT` | Stop here, accept the mail (also the implicit outcome if every plugin returns `CONTINUE`) |
| `REJECT` | Stop here, reject the SMTP transaction |
| `DEFER` | Stop here, temp-fail — used for panics and for DB/lookup errors that shouldn't be treated as a hard reject |
| `DISCARD` | Stop here, accept the SMTP transaction but drop the mail — the sender sees success, nobody receives anything |

## `Mail`, the object every plugin shares

```go
type Mail struct {
	QueueID            string
	From               string
	To                 []string
	Data               []byte
	Headers            map[string]string
	IsProtected        bool
	EnvelopeFrom       []string
	SpamScore          float64
	FilterBlackEntries []string
	AllFrom            []string
}
```

`SpamScore` is the running total that scoring plugins (`validate_from`,
`spf_dkim_check`, and any other plugin that decides to penalize a message) add to as
the chain runs; `spam_destination` reads the final number at the end to decide where
the mail lands. `GetHeader` tries a direct map lookup first (O(1)) and only falls back
to a case-insensitive linear scan if that misses — most headers arrive with the casing
you'd expect, so the fast path covers the common case.

## SMTP backend and reinjection

`internal/server` is a thin `go-smtp` `Backend`/`Session` — it assembles a `model.Mail`
from the SMTP transaction and hands it to `pipeline.Handler.Handle`. Whatever the
pipeline decides, `internal/reinject` is what actually re-sends the (possibly modified)
message back out over plain SMTP to `OUTGOING_HOST:OUTGOING_PORT` — Postfix again, in
the normal deployment, for final local delivery. Reinjection retries up to 3 times with
exponential backoff (500ms, 1s, 2s, capped at 10s) before it gives up and logs the
failure — it does not queue the message anywhere for a later retry beyond that.

## Registering a plugin

Every plugin package self-registers from its own `init()`:

```go
func init() {
	plugin.Register("spoof_check", func() plugin.Plugin {
		return &Plugin{}
	})
}
```

`plugins/plugins.go` blank-imports every plugin subpackage, and `cmd/server/main.go`
blank-imports that (`_ "y-cfiler-relayin/plugins"`) purely to trigger all those
`init()` calls at process start. Registering a plugin only makes it available to be
named — nothing runs unless it's also listed in `PLUGINS`. A plugin that's compiled in
but missing from that env var never executes for any message.
