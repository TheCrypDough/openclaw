/*
 * AUTO ANNOTATION
 * File: src/test-helpers/state-dir-env.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  restoreStateDirEnv,
  setStateDirEnv,
  snapshotStateDirEnv,
  withStateDirEnv,
} from "./state-dir-env.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type EnvSnapshot = {
  openclaw?: string;
  legacy?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function snapshotCurrentStateDirVars(): EnvSnapshot {
  return {
    openclaw: process.env.OPENCLAW_STATE_DIR,
    legacy: process.env.CLAWDBOT_STATE_DIR,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function expectStateDirVars(snapshot: EnvSnapshot) {
  expect(process.env.OPENCLAW_STATE_DIR).toBe(snapshot.openclaw);
  expect(process.env.CLAWDBOT_STATE_DIR).toBe(snapshot.legacy);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function expectPathMissing(filePath: string) {
  await expect(fs.stat(filePath)).rejects.toThrow();
}

describe("state-dir-env helpers", () => {
  it("set/snapshot/restore round-trips OPENCLAW_STATE_DIR", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prev = snapshotCurrentStateDirVars();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const snapshot = snapshotStateDirEnv();

    setStateDirEnv("/tmp/openclaw-state-dir-test");
    expect(process.env.OPENCLAW_STATE_DIR).toBe("/tmp/openclaw-state-dir-test");
    expect(process.env.CLAWDBOT_STATE_DIR).toBeUndefined();

    restoreStateDirEnv(snapshot);
    expectStateDirVars(prev);
  });

  it("withStateDirEnv sets env for callback and cleans up temp root", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prev = snapshotCurrentStateDirVars();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let capturedTempRoot = "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let capturedStateDir = "";
    await withStateDirEnv("openclaw-state-dir-env-", async ({ tempRoot, stateDir }) => {
      capturedTempRoot = tempRoot;
      capturedStateDir = stateDir;
      expect(process.env.OPENCLAW_STATE_DIR).toBe(stateDir);
      expect(process.env.CLAWDBOT_STATE_DIR).toBeUndefined();
      await fs.writeFile(path.join(stateDir, "probe.txt"), "ok", "utf8");
    });

    expectStateDirVars(prev);
    await expectPathMissing(capturedStateDir);
    await expectPathMissing(capturedTempRoot);
  });

  it("withStateDirEnv restores env and cleans temp root when callback throws", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prev = snapshotCurrentStateDirVars();

    let capturedTempRoot = "";
    let capturedStateDir = "";
    await expect(
      withStateDirEnv("openclaw-state-dir-env-", async ({ tempRoot, stateDir }) => {
        capturedTempRoot = tempRoot;
        capturedStateDir = stateDir;
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");

    expectStateDirVars(prev);
    await expectPathMissing(capturedStateDir);
    await expectPathMissing(capturedTempRoot);
  });
});
