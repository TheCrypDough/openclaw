# Folder Annotation

- **Path:** `src/process`
- **Folder role:** Core application source (gateway, CLI, providers, channels)
- **Contains:** 1 folders, 12 files

## Purpose
This folder stores components that collectively support the role above.

## System effect
Changes in this folder influence the runtime behavior of its subsystem and can alter how user requests, integrations, or tooling are processed.

## Contents overview
### Subfolders
- supervisor/
### Files
- child-process-bridge.ts
- kill-tree.ts
- spawn-utils.ts
- child-process-bridge.test.ts
- lanes.ts
- restart-recovery.ts
- spawn-utils.test.ts
- kill-tree.test.ts
- exec.test.ts
- command-queue.test.ts
- command-queue.ts
- exec.ts

