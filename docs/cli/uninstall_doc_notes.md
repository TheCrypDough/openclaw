<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: docs/cli/uninstall.md
- **Purpose:** Document file describing configuration/behavior for OpenClaw area user and developer documentation source used for docs site.
- **Module area:** User and developer documentation source used for docs site
- **System effect:** Documentation directly affects operator understanding and onboarding/developer guidance, not runtime directly.
---
summary: "CLI reference for `openclaw uninstall` (remove gateway service + local data)"
read_when:
  - You want to remove the gateway service and/or local state
  - You want a dry-run first
title: "uninstall"
---

# `openclaw uninstall`

Uninstall the gateway service + local data (CLI remains).

```bash
openclaw uninstall
openclaw uninstall --all --yes
openclaw uninstall --dry-run
```
