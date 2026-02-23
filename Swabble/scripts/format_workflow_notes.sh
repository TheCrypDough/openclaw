/*
 * AUTO ANNOTATION
 * File: Swabble/scripts/format.sh
 * Purpose: File in Swabble area for project orchestration/configuration/data.
 * Module area: Swift package subtree for related mobile tooling
 * System effect: Change can influence swift package subtree for related mobile tooling and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG="${ROOT}/.swiftformat"
swiftformat --config "$CONFIG" "$ROOT/Sources"
