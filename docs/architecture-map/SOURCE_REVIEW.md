# Source review

Snapshot: `a54dc7fe80fc02e2a02e6901668a468fcb0cf8b4` of https://github.com/TheCrypDough/openclaw; inspected 2026-10-03.

Inspected fork README and full root AGENTS, CLI entry, gateway imports and startup composition, routing/session key resolution, channel registry, embedded-runner exports, tool split, configuration IO, plugin loader and history handling. This map describes this fork at the pinned commit; it does not claim current upstream release parity. No messaging account, model provider, device app or gateway was started. All evidence and links are confined to this public repository.

## Evidence

- CLI and control UI: `src/entry.ts`, `ui/src/ui/app.ts`
- Gateway server: `src/gateway/server.impl.ts`
- Agent routing: `src/routing/resolve-route.ts`
- Channel plugins: `src/channels/plugins/index.ts`
- Embedded agent runner: `src/agents/pi-embedded-runner.ts`
- Tool interfaces: `src/agents/pi-embedded-runner/tool-split.ts`
- Local configuration: `src/config/io.ts`
- Plugin loader: `src/plugins/loader.ts`
- Session history: `src/agents/pi-embedded-runner/history.ts`

## Limits

This map summarizes principal source seams. The adjacent tracked inventory covers the complete committed file tree. No application code, company authority, customer data, credentials or deployment changed. Generated evidence belongs to this repository only.
