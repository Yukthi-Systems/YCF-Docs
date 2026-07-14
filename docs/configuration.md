---
id: configuration
title: Configuration
sidebar_position: 5
---

# Configuration

All configuration is environment variables, read once in `internal/config/config.go`.
Every variable has a built-in default, so the binary starts without any configuration
at all — but `PG_DNS` and `RABBITMQ_URL` in particular are placeholder values, not a
`localhost` you can develop against out of the box. Set both explicitly before running
this anywhere.

## Server

| Variable | Default | Purpose |
|---|---|---|
| `SERVER_HOST` | `127.0.0.1` | Interface the SMTP server binds to |
| `SERVER_PORT` | `10025` | Port the SMTP server listens on |
| `SERVER_READ_TIMEOUT` | `30s` | Per-connection read timeout |
| `SERVER_WRITE_TIMEOUT` | `30s` | Per-connection write timeout |
| `MAX_MESSAGE_BYTES` | `52428800` (50MB) | Largest `DATA` payload accepted |
| `MAX_RECIPIENTS` | `1000` | Largest RCPT count accepted per transaction |
| `OUTGOING_HOST` | `127.0.0.1` | Host mail is re-injected to after filtering (normally Postfix again) |
| `OUTGOING_PORT` | `10026` | Port on that host |

## Plugins

| Variable | Default | Purpose |
|---|---|---|
| `PLUGINS` | `digest_check,add_euid,validate_from,archive,spoof_check,spf_dkim_check,add_caution,filter_policies,general_policies,forwarding_policies,attachment_policies,distribution_policies,spam_destination` | Comma-separated, order-sensitive plugin chain — see [Plugin Reference](./plugins.md) |

## PostgreSQL

| Variable | Default | Purpose |
|---|---|---|
| `PG_DNS` | *(placeholder — override this)* | Connection string |
| `PG_MAX_CONNS` | `10` | Pool max connections |
| `PG_MIN_CONNS` | `2` | Pool min connections |

## RabbitMQ

| Variable | Default | Purpose |
|---|---|---|
| `RABBITMQ_URL` | *(placeholder — override this)* | Connection string |
| `RABBITMQ_ARCHIVE_QUEUE` | `mail_archive` | Queue the `archive` plugin publishes to |
| `RABBITMQ_ADMIN_LOG_QUEUE` | `mail_admin_log` | Queue admin-log events are published to |
| `RABBITMQ_RETRY_IDLE` | `5s` | Idle delay between publish retries |

## Spam scoring

| Variable | Default | Purpose |
|---|---|---|
| `SPAM_THRESHOLD_1` | `8.0` | Below this, mail goes straight to inbox |
| `SPAM_THRESHOLD_2` | `12.0` | At or above this, mail is discarded outright; between the two thresholds, it's routed per the domain's spam destination |
| `FROM_MISS_SPAM_SCORE` | `5.0` | Added by `validate_from` when `MAIL FROM` was empty |
| `SPF_FAIL_SPAM_SCORE` | `2.0` | Added by `spf_dkim_check` on SPF fail/softfail/permerror/temperror |
| `DKIM_FAIL_SPAM_SCORE` | `4.0` | Added by `spf_dkim_check` on DKIM fail/policy/neutral/permerror |

## Attachments

| Variable | Default | Purpose |
|---|---|---|
| `ATTACHMENT_SIZE_MB` | `50` | Max size handled by attachment extraction |
| `ATTACHMENT_EXTRACT_MAX_DEPTH` | `2` | Max nesting depth when extracting attachments from archives |
| `ATTACHMENT_EXTRACT_MAX_FILES` | `100` | Max files extracted from a single attachment |

## Logging

| Variable | Default | Purpose |
|---|---|---|
| `LOG_FILE` | `logs/app.log` | Log file path |
| `LOG_MAX_SIZE_MB` | `50` | Rotate after this size |
| `LOG_MAX_BACKUPS` | `5` | Rotated files to keep |
| `LOG_MAX_AGE_DAYS` | `14` | Days to keep rotated files |
| `LOG_COMPRESS` | `true` | Gzip rotated files |
| `LOG_LEVEL` | `debug` | zerolog level: `trace`/`debug`/`info`/`warn`/`error` |
| `LOG_CONSOLE` | `false` | Also write logs to stderr — useful in development, noisy in production |
