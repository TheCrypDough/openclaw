/*
 * AUTO ANNOTATION
 * File: src/test-utils/temp-home.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createTempHomeEnv } from "./temp-home.js";

describe("createTempHomeEnv", () => {
  it("sets home env vars and restores them on cleanup", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const previousHome = process.env.HOME;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const previousUserProfile = process.env.USERPROFILE;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const previousStateDir = process.env.OPENCLAW_STATE_DIR;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tempHome = await createTempHomeEnv("openclaw-temp-home-");
    expect(process.env.HOME).toBe(tempHome.home);
    expect(process.env.USERPROFILE).toBe(tempHome.home);
    expect(process.env.OPENCLAW_STATE_DIR).toBe(path.join(tempHome.home, ".openclaw"));
    await expect(fs.stat(tempHome.home)).resolves.toMatchObject({
      isDirectory: expect.any(Function),
    });

    await tempHome.restore();

    expect(process.env.HOME).toBe(previousHome);
    expect(process.env.USERPROFILE).toBe(previousUserProfile);
    expect(process.env.OPENCLAW_STATE_DIR).toBe(previousStateDir);
    await expect(fs.stat(tempHome.home)).rejects.toThrow();
  });
});
