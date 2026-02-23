/*
 * AUTO ANNOTATION
 * File: scripts/sandbox-browser-setup.sh
 * Purpose: Operational script for maintenance/build/release/test workflows (sandbox-browser-setup.sh).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="openclaw-sandbox-browser:bookworm-slim"

docker build -t "${IMAGE_NAME}" -f Dockerfile.sandbox-browser .
echo "Built ${IMAGE_NAME}"
