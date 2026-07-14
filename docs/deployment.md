---
id: deployment
title: Deployment
sidebar_position: 6
---

# Deployment

## Docker

Multi-stage build: compiled on `golang:1.25-bookworm` (with `libgmime-3.0-dev`,
`pkg-config`, and `gcc` installed for the CGo build), then copied into a
`debian:bookworm-slim` runtime image with just `libgmime-3.0-0`, `ca-certificates`, and
`tzdata` — enough to run the CGo binary, not a full build toolchain.

```bash
docker build -t ycf-relay-in .
```

```bash
docker run -d -p 127.0.0.1:1025:10025 ycf-relay-in
```

The container exposes port `10025` and ships both the `server` and `healthcheck`
binaries — `healthcheck` is what the Docker `HEALTHCHECK` directive runs, not something
you invoke directly.

## Docker Compose

```yaml
services:
  ycf-relay-in:
    image: rjyspl/ycf-relay-in:latest
    container_name: ycf-relay-in
    ports:
      - "127.0.0.1:1025:10025"
    extra_hosts:
      - "host.docker.internal:host-gateway"
    environment:
      - TZ=Asia/Kolkata
      - LOG_FILE=./logs/app.log
      - LOG_LEVEL=debug
      - LOG_CONSOLE=false
      - SERVER_PORT=10025
      - SERVER_HOST=0.0.0.0
      - MAX_MESSAGE_BYTES=52428800
      - MAX_RECIPIENTS=1000
      - PLUGINS=digest_check,add_euid,validate_from,archive,spoof_check,spf_dkim_check,add_caution,filter_policies,general_policies,forwarding_policies,attachment_policies,distribution_policies,spam_destination
      - RABBITMQ_URL=amqp://user:pass@host:5672/
      - RABBITMQ_ARCHIVE_QUEUE=mail_archive
      - OUTGOING_HOST=host.docker.internal
      - OUTGOING_PORT=10026
      - PG_DNS=postgres://user:pass@host:5432/ycf?sslmode=disable
      - SPAM_THRESHOLD_1=8.0
      - SPAM_THRESHOLD_2=12.0
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "./healthcheck"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    restart: always
```

`host.docker.internal` is there so the container can reach Postfix running on the host
itself for reinjection (`OUTGOING_HOST`) — drop it if Postfix runs in its own
container or elsewhere on the network instead. The `./logs` volume is what makes the
rotating log file survive a container restart; without it, logs disappear when the
container is recreated.

See [Configuration](./configuration.md) for the full list of environment variables —
the block above is a working subset, not everything.

## CI

`.github/workflows/main.yml` builds and pushes `rjyspl/ycf-relay-in` to Docker Hub on
every push to `main` and on every tag, tagging the image both `latest` and with the
tag/branch name. There's no separate test job — the workflow goes straight from
checkout to build-and-push.
