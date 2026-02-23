<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: src/hooks/bundled/boot-md/HOOK.md
- **Purpose:** Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
- **Module area:** Core application source (gateway, CLI, providers, channels)
- **System effect:** When changed, core execution path for message, session, or provider behavior may change.
---
name: boot-md
description: "Run BOOT.md on gateway startup"
homepage: https://docs.openclaw.ai/automation/hooks#boot-md
metadata:
  {
    "openclaw":
      {
        "emoji": "🚀",
        "events": ["gateway:startup"],
        "requires": { "config": ["workspace.dir"] },
        "install": [{ "id": "bundled", "kind": "bundled", "label": "Bundled with OpenClaw" }],
      },
  }
---

# Boot Checklist Hook

Runs `BOOT.md` at gateway startup for each configured agent scope, if the file exists in that
agent's resolved workspace.
