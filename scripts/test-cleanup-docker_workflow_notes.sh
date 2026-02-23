/*
 * AUTO ANNOTATION
 * File: scripts/test-cleanup-docker.sh
 * Purpose: Operational script for maintenance/build/release/test workflows (test-cleanup-docker.sh).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_NAME="${OPENCLAW_CLEANUP_SMOKE_IMAGE:-${CLAWDBOT_CLEANUP_SMOKE_IMAGE:-openclaw-cleanup-smoke:local}}"

echo "==> Build image: $IMAGE_NAME"
docker build \
  -t "$IMAGE_NAME" \
  -f "$ROOT_DIR/scripts/docker/cleanup-smoke/Dockerfile" \
  "$ROOT_DIR"

echo "==> Run cleanup smoke test"
docker run --rm -t "$IMAGE_NAME"
