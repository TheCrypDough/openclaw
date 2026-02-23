<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: extensions/google-antigravity-auth/README.md
- **Purpose:** Extension package component that adds a channel/tool integration or adapter.
- **Module area:** Pluggable channel and service extensions
- **System effect:** Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
# Google Antigravity Auth (OpenClaw plugin)

OAuth provider plugin for **Google Antigravity** (Cloud Code Assist).

## Enable

Bundled plugins are disabled by default. Enable this one:

```bash
openclaw plugins enable google-antigravity-auth
```

Restart the Gateway after enabling.

## Authenticate

```bash
openclaw models auth login --provider google-antigravity --set-default
```

## Notes

- Antigravity uses Google Cloud project quotas.
- If requests fail, ensure Gemini for Google Cloud is enabled.
