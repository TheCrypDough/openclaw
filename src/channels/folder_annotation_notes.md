# Folder Annotation

- **Path:** `src/channels`
- **Folder role:** Core application source (gateway, CLI, providers, channels)
- **Contains:** 4 folders, 32 files

## Purpose
This folder stores components that collectively support the role above.

## System effect
Changes in this folder influence the runtime behavior of its subsystem and can alter how user requests, integrations, or tooling are processed.

## Contents overview
### Subfolders
- web/
- plugins/
- allowlists/
- telegram/
### Files
- location.test.ts
- targets.ts
- draft-stream-loop.ts
- location.ts
- channel-config.test.ts
- conversation-label.ts
- allowlist-match.ts
- dock.ts
- status-reactions.ts
- ack-reactions.test.ts
- typing.ts
- account-summary.ts
- allow-from.ts
- mention-gating.ts
- allow-from.test.ts
- channel-config.ts
- logging.ts
- reply-prefix.ts
- command-gating.test.ts
- ack-reactions.ts
- sender-label.ts
- registry.ts
- sender-identity.ts
- model-overrides.ts
- chat-type.ts
- command-gating.ts
- mention-gating.test.ts
- model-overrides.test.ts
- channels-misc.test.ts
- channel-helpers.test.ts
- session.ts
- status-reactions.test.ts

