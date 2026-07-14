---
id: getting-started
title: Getting Started
sidebar_position: 2
---

# Getting Started

## Prerequisites

- Go 1.25+
- GMime 3.0 development headers, a C compiler, and `pkg-config`. The EML parser
  (`internal/eml`) is a CGo binding to GMime, not pure Go — you need `CGO_ENABLED=1`
  and the library installed to build this at all. On Debian/Ubuntu:
  `apt install pkg-config libgmime-3.0-dev gcc libc6-dev`.
- A reachable PostgreSQL instance with the policy tables the plugins query —
  `domains`, `organizations`, `mailboxes`, `filter_policies`, `general_policies`,
  `forwarding_policies`, `attachment_policies`, `cautions`, `distribution_policies`.
  There's no migration/schema file in this repo yet; see
  [Plugin Reference](./plugins.md) for the exact query (and therefore the columns) each
  plugin expects.
- A RabbitMQ instance (used by the `archive` plugin and by admin-log publishing)
- Something upstream feeding it mail. In production that's Postfix, relaying to
  RelayIn's `SERVER_HOST:SERVER_PORT` after Amavis, with RelayIn re-injecting accepted
  mail back out to `OUTGOING_HOST:OUTGOING_PORT`. Locally, a plain SMTP client like
  `swaks` pointed at the listening port is enough to poke at it directly without
  standing up Postfix at all.

## Clone and build

```bash
git clone https://github.com/Yukthi-Systems/YCF-RelayIn.git
cd YCF-RelayIn
go mod tidy
go build -o server ./cmd/server
go build -o healthcheck ./cmd/healthcheck
```

## Configure environment variables

Every setting has a default baked into `internal/config/config.go` (see
[Configuration](./configuration.md)) — `PG_DNS` and `RABBITMQ_URL` in particular are
placeholders, not something you can develop against as-is. Set both explicitly before
running this. At minimum for a local run:

```bash
export PG_DNS="postgres://user:pass@localhost:5432/ycf?sslmode=disable"
export RABBITMQ_URL="amqp://guest:guest@localhost:5672/"
export SERVER_HOST=127.0.0.1
export SERVER_PORT=10025
export OUTGOING_HOST=127.0.0.1
export OUTGOING_PORT=10026
```

## Run it

```bash
./server
```

or directly:

```bash
go run ./cmd/server
```

It logs to `logs/app.log` (JSON lines, rotated via lumberjack) by default — set
`LOG_CONSOLE=true` to also mirror to stderr while developing. On startup it
initializes GMime, connects to Postgres and RabbitMQ, builds the plugin chain from
`PLUGINS`, and starts listening for SMTP connections.

Send it a test message:

```bash
swaks --to test@yourdomain.com --from someone@example.com --server 127.0.0.1:10025
```

and follow the log lines — every plugin logs its own start and finish tagged with a
`euid`, which is the `X-YSPL-ID` UUID that the `add_euid` plugin stamps onto the mail
early in the chain. Filtering the log by that one value gets you the whole story of
what happened to a single message.

Ctrl-C sends `SIGTERM`; the server stops accepting new connections and gives in-flight
`DATA` commands up to 60 seconds to finish before it closes the Postgres pool and the
RabbitMQ connection.
