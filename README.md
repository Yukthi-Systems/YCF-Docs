# YCF Docs

Documentation site for **YCF** (Yukthi Content Filter) — specifically `RelayIn`, the
Go SMTP service that applies inbound mail policy (spoof detection, SPF/DKIM scoring,
block lists, attachment rules, spam-score routing) after Postfix and Amavis have
already handled virus/spam scanning. Built with [Docusaurus](https://docusaurus.io/).

Docs live in [`docs/`](docs), covering:

- [Introduction](docs/intro.md) — what YCF is and where it sits in the mail path
- [Getting Started](docs/getting-started.md)
- [Architecture](docs/architecture.md) — the plugin pipeline
- [Plugin Reference](docs/plugins.md) — all 13 shipped plugins, in detail
- [Configuration](docs/configuration.md)
- [Deployment](docs/deployment.md)
- [Contributing](docs/contributing.md)

## Development

```bash
npm install
npm start
```

Starts a local dev server with hot reload at `http://localhost:3000`.

## Build

```bash
npm run build
```

Generates a static production build into `build/`, servable by any static host.

```bash
npm run serve
```

Serves that production build locally.

Each doc page shows a "Last updated on ... by ..." line, sourced from `git log` for
that file (`showLastUpdateAuthor`/`showLastUpdateTime` in `docusaurus.config.ts`).
That means the build needs real git history to read from — a shallow clone
(`git clone --depth 1`, or CI's default `actions/checkout`) means every page shows the
same single commit instead of its actual last change. Use `fetch-depth: 0` in any CI
checkout step that builds this site.

## Contributing

See [Open Source & Contributing](https://yukthi-systems.github.io/Yukthi-Content-Filter-Docs/open-source)
for how to contribute and how serious contributions are recognized.

## License

GPLv3 — see [`LICENSE`](LICENSE).
