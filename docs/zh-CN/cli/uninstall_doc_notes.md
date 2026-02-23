<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: docs/zh-CN/cli/uninstall.md
- **Purpose:** Document file describing configuration/behavior for OpenClaw area user and developer documentation source used for docs site.
- **Module area:** User and developer documentation source used for docs site
- **System effect:** Documentation directly affects operator understanding and onboarding/developer guidance, not runtime directly.
---
read_when:
  - 你想移除 Gateway 网关服务和/或本地状态
  - 你想先进行试运行
summary: "`openclaw uninstall` 的 CLI 参考（移除 Gateway 网关服务 + 本地数据）"
title: uninstall
x-i18n:
  generated_at: "2026-02-03T10:04:23Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 8d6c3890923f18f95c12b76443d649a6b404934ebd054fb86a9fa1abae843fe4
  source_path: cli/uninstall.md
  workflow: 15
---

# `openclaw uninstall`

卸载 Gateway 网关服务 + 本地数据（CLI 保留）。

```bash
openclaw uninstall
openclaw uninstall --all --yes
openclaw uninstall --dry-run
```
