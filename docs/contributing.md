---
id: contributing
title: Contributing
sidebar_position: 7
---

# Contributing

## Building a new plugin

Plugins are the main extension point. To add one:

1. Create a package under `plugins/yourplugin/`.
2. Implement `plugin.Plugin` — `Name() string` and `Run(ctx plugin.Context, mail
   *model.Mail) model.Result`.
3. Register it from an `init()`:
   ```go
   func init() {
       plugin.Register("your_plugin_name", func() plugin.Plugin {
           return &Plugin{}
       })
   }
   ```
4. Add a blank import for the package to `plugins/plugins.go`.
5. Add `your_plugin_name` to the `PLUGINS` env var wherever you want it to actually run
   — registering it isn't enough on its own, see [Architecture](./architecture.md).

Keep plugins narrow — one policy concern per plugin, matching how every shipped
plugin is scoped. A plugin that panics gets recovered into `DEFER` automatically, so
there's no need to wrap your own logic in a `recover()`; do make sure a lookup error
degrades to `CONTINUE`/`DEFER` rather than a hard `REJECT`, following the pattern the
existing plugins use for database errors.

## Code style

Standard `gofmt`. A few things already inconsistent in the existing plugin code that
are worth *not* copying into new plugins even though they exist in old ones:
`snake_case` local variable and function names (Go convention is `camelCase`), and
leftover commented-out code blocks. New code should follow normal Go conventions even
where older files in this repo don't yet.

## Workflow

1. Fork the repository
2. Create a branch for your change
3. Match the existing plugin/package layout for anything touching `plugins/` — see
   [Architecture](./architecture.md)
4. Open a pull request with a clear description of what changed and why

## Reporting issues

Include the plugin chain you're running (`PLUGINS`), the relevant log lines for one
`euid` if you have them, and what you expected to happen instead.
