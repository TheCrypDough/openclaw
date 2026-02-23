/*
 * AUTO ANNOTATION
 * File: src/test-helpers/state-dir-env.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { captureEnv } from "../test-utils/env.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function snapshotStateDirEnv() {
  return captureEnv(["OPENCLAW_STATE_DIR", "CLAWDBOT_STATE_DIR"]);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function restoreStateDirEnv(snapshot: ReturnType<typeof snapshotStateDirEnv>): void {
  snapshot.restore();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setStateDirEnv(stateDir: string): void {
  process.env.OPENCLAW_STATE_DIR = stateDir;
  delete process.env.CLAWDBOT_STATE_DIR;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withStateDirEnv<T>(
  prefix: string,
  fn: (ctx: { tempRoot: string; stateDir: string }) => Promise<T>,
): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const snapshot = snapshotStateDirEnv();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stateDir = path.join(tempRoot, "state");
  await fs.mkdir(stateDir, { recursive: true });
  setStateDirEnv(stateDir);
  try {
    return await fn({ tempRoot, stateDir });
  } finally {
    restoreStateDirEnv(snapshot);
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}
