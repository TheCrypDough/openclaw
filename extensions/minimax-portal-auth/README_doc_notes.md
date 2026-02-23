<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: extensions/minimax-portal-auth/README.md
- **Purpose:** Extension package component that adds a channel/tool integration or adapter.
- **Module area:** Pluggable channel and service extensions
- **System effect:** Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
# MiniMax OAuth (OpenClaw plugin)

OAuth provider plugin for **MiniMax** (OAuth).

## Enable

Bundled plugins are disabled by default. Enable this one:

```bash
openclaw plugins enable minimax-portal-auth
```

Restart the Gateway after enabling.

```bash
openclaw gateway restart
```

## Authenticate

```bash
openclaw models auth login --provider minimax-portal --set-default
```

You will be prompted to select an endpoint:

- **Global** - International users, optimized for overseas access (`api.minimax.io`)
- **China** - Optimized for users in China (`api.minimaxi.com`)

## Notes

- MiniMax OAuth uses a user-code login flow.
- Currently, OAuth login is supported only for the Coding plan
