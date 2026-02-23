<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: docs/cli/logs.md
- **Purpose:** Document file describing configuration/behavior for OpenClaw area user and developer documentation source used for docs site.
- **Module area:** User and developer documentation source used for docs site
- **System effect:** Documentation directly affects operator understanding and onboarding/developer guidance, not runtime directly.
---
summary: "CLI reference for `openclaw logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
title: "logs"
---

# `openclaw logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
openclaw logs
openclaw logs --follow
openclaw logs --json
openclaw logs --limit 500
openclaw logs --local-time
openclaw logs --follow --local-time
```

Use `--local-time` to render timestamps in your local timezone.
