<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: src/gateway/server-methods/AGENTS.md
- **Purpose:** Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
- **Module area:** Core application source (gateway, CLI, providers, channels)
- **System effect:** When changed, core execution path for message, session, or provider behavior may change.
# Gateway Server Methods Notes

- Pi session transcripts are a `parentId` chain/DAG; never append Pi `type: "message"` entries via raw JSONL writes (missing `parentId` can sever the leaf path and break compaction/history). Always write transcript messages via `SessionManager.appendMessage(...)` (or a wrapper that uses it).
