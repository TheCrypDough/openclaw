<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: extensions/open-prose/README.md
- **Purpose:** Extension package component that adds a channel/tool integration or adapter.
- **Module area:** Pluggable channel and service extensions
- **System effect:** Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
# OpenProse (plugin)

Adds the OpenProse skill pack and `/prose` slash command.

## Enable

Bundled plugins are disabled by default. Enable this one:

```json
{
  "plugins": {
    "entries": {
      "open-prose": { "enabled": true }
    }
  }
}
```

Restart the Gateway after enabling.

## What you get

- `/prose` slash command (user-invocable skill)
- OpenProse VM semantics (`.prose` programs + multi-agent orchestration)
- Telemetry support (best-effort, per OpenProse spec)
