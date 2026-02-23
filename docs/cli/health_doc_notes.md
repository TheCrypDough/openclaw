<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: docs/cli/health.md
- **Purpose:** Document file describing configuration/behavior for OpenClaw area user and developer documentation source used for docs site.
- **Module area:** User and developer documentation source used for docs site
- **System effect:** Documentation directly affects operator understanding and onboarding/developer guidance, not runtime directly.
---
summary: "CLI reference for `openclaw health` (gateway health endpoint via RPC)"
read_when:
  - You want to quickly check the running Gateway’s health
title: "health"
---

# `openclaw health`

Fetch health from the running Gateway.

```bash
openclaw health
openclaw health --json
openclaw health --verbose
```

Notes:

- `--verbose` runs live probes and prints per-account timings when multiple accounts are configured.
- Output includes per-agent session stores when multiple agents are configured.
