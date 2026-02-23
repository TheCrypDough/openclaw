<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: docs/cli/tui.md
- **Purpose:** Document file describing configuration/behavior for OpenClaw area user and developer documentation source used for docs site.
- **Module area:** User and developer documentation source used for docs site
- **System effect:** Documentation directly affects operator understanding and onboarding/developer guidance, not runtime directly.
---
summary: "CLI reference for `openclaw tui` (terminal UI connected to the Gateway)"
read_when:
  - You want a terminal UI for the Gateway (remote-friendly)
  - You want to pass url/token/session from scripts
title: "tui"
---

# `openclaw tui`

Open the terminal UI connected to the Gateway.

Related:

- TUI guide: [TUI](/web/tui)

## Examples

```bash
openclaw tui
openclaw tui --url ws://127.0.0.1:18789 --token <token>
openclaw tui --session main --deliver
```
