<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: docs/cli/reset.md
- **Purpose:** Document file describing configuration/behavior for OpenClaw area user and developer documentation source used for docs site.
- **Module area:** User and developer documentation source used for docs site
- **System effect:** Documentation directly affects operator understanding and onboarding/developer guidance, not runtime directly.
---
summary: "CLI reference for `openclaw reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `openclaw reset`

Reset local config/state (keeps the CLI installed).

```bash
openclaw reset
openclaw reset --dry-run
openclaw reset --scope config+creds+sessions --yes --non-interactive
```
