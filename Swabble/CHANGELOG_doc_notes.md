<!-- AUTOPLACEHOLDER_ANNOTATION -->
## File Annotation: Swabble/CHANGELOG.md
- **Purpose:** File in Swabble area for project orchestration/configuration/data.
- **Module area:** Swift package subtree for related mobile tooling
- **System effect:** Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
# Changelog

## 0.2.0 — 2025-12-23

### Highlights
- Added `SwabbleKit` (multi-platform wake-word gate utilities with segment-aware gap detection).
- Swabble package now supports iOS + macOS consumers; CLI remains macOS 26-only.

### Changes
- CLI wake-word matching/stripping routed through `SwabbleKit` helpers.
- Speech pipeline types now explicitly gated to macOS 26 / iOS 26 availability.
