/*
 * AUTO ANNOTATION
 * File: src/infra/device-identity.state-dir.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { withStateDirEnv } from "../test-helpers/state-dir-env.js";
import { loadOrCreateDeviceIdentity } from "./device-identity.js";

describe("device identity state dir defaults", () => {
  it("writes the default identity file under OPENCLAW_STATE_DIR", async () => {
    await withStateDirEnv("openclaw-identity-state-", async ({ stateDir }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const identity = loadOrCreateDeviceIdentity();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const identityPath = path.join(stateDir, "identity", "device.json");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const raw = JSON.parse(await fs.readFile(identityPath, "utf8")) as { deviceId?: string };
      expect(raw.deviceId).toBe(identity.deviceId);
    });
  });
});
