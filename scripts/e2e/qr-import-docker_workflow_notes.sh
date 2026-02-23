/*
 * AUTO ANNOTATION
 * File: scripts/e2e/qr-import-docker.sh
 * Purpose: Operational script for maintenance/build/release/test workflows (qr-import-docker.sh).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
IMAGE_NAME="${OPENCLAW_QR_SMOKE_IMAGE:-${CLAWDBOT_QR_SMOKE_IMAGE:-openclaw-qr-smoke}}"

echo "Building Docker image..."
docker build -t "$IMAGE_NAME" -f "$ROOT_DIR/scripts/e2e/Dockerfile.qr-import" "$ROOT_DIR"

echo "Running qrcode-terminal import smoke..."
docker run --rm -t "$IMAGE_NAME" node -e "import('qrcode-terminal').then((m)=>m.default.generate('qr-smoke',{small:true}))"
