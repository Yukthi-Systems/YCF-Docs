---
id: intro
title: Introduction
sidebar_position: 1
slug: /
---

# YCF (RelayIn)

YCF — Yukthi Content Filter — is the inbound mail policy layer that sits between
Postfix and final delivery. This repo, `RelayIn`, is the inbound half of it: a small Go
SMTP server that Postfix hands every incoming message to after Amavis has already
scanned it for viruses and spam, and that decides what actually happens to that message
before it gets re-injected back into Postfix for delivery.

```text
POSTFIX <-> MILTER
POSTFIX -> AMAVIS
AMAVIS  -> [CLAMAV - SPAMASSASSIN]
AMAVIS  -> POSTFIX
POSTFIX -> YCF          (this service)
YCF     -> POSTFIX      (re-injected: accepted, tagged, or discarded)
```

Amavis / ClamAV / SpamAssassin already handle the generic virus-and-spam case upstream.
YCF is the layer on top of that: per-organization and per-domain policy — spoof
detection, SPF/DKIM scoring, block/allow lists, attachment rules, forwarding,
distribution-list membership, and a final spam-score decision about which folder a
message lands in, if it lands anywhere at all.

It's not a milter in the sendmail/libmilter sense, despite the name of the repo it grew
out of. It speaks plain SMTP (`github.com/emersion/go-smtp`), and Postfix is set up to
relay to it as a next hop, not attach it over a milter socket.

## What it does, in one pass

Every message goes through an ordered chain of plugins — middleware for an SMTP
transaction, basically. Each plugin looks at the mail, does its one job (tag a header,
look up a policy row in Postgres, add to a running spam score), and returns one of five
verdicts: `CONTINUE`, `ACCEPT`, `REJECT`, `DEFER`, `DISCARD`. The chain runs top to
bottom and stops at the first plugin that returns anything other than `CONTINUE` — so a
`spoof_check` discard early in the chain means attachment scanning, caution banners, and
distribution-list rules never even run for that message.

A panic inside any plugin is recovered and turned into `DEFER` rather than crashing the
session or the server — see [Architecture](./architecture.md) for why that matters.

## Where to go next

- [Getting Started](./getting-started.md) — running it locally against Postgres,
  RabbitMQ, and a mail server
- [Architecture](./architecture.md) — the plugin pipeline, the SMTP backend,
  reinjection back to Postfix
- [Plugin Reference](./plugins.md) — what each of the 13 shipped plugins checks, and
  the exact SQL/config behind it
- [Configuration](./configuration.md) — every environment variable, with defaults
- [Deployment](./deployment.md) — Docker image, healthcheck binary, the CI build
