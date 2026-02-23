<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: extensions/copilot-proxy/README.md
- **Purpose:** Extension package component that adds a channel/tool integration or adapter.
- **Module area:** Pluggable channel and service extensions
- **System effect:** Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
# Copilot Proxy (OpenClaw plugin)

Provider plugin for the **Copilot Proxy** VS Code extension.

## Enable

Bundled plugins are disabled by default. Enable this one:

```bash
openclaw plugins enable copilot-proxy
```

Restart the Gateway after enabling.

## Authenticate

```bash
openclaw models auth login --provider copilot-proxy --set-default
```

## Notes

- Copilot Proxy must be running in VS Code.
- Base URL must include `/v1`.
