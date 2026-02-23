/*
 * AUTO ANNOTATION
 * File: src/canvas-host/server.state-dir.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { defaultRuntime } from "../runtime.js";
import { withStateDirEnv } from "../test-helpers/state-dir-env.js";
import { createCanvasHostHandler } from "./server.js";

describe("canvas host state dir defaults", () => {
  it("uses OPENCLAW_STATE_DIR for the default canvas root", async () => {
    await withStateDirEnv("openclaw-canvas-state-", async ({ stateDir }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const handler = await createCanvasHostHandler({
        runtime: defaultRuntime,
        allowInTests: true,
      });

      try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const expectedRoot = await fs.realpath(path.join(stateDir, "canvas"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const actualRoot = await fs.realpath(handler.rootDir);
        expect(actualRoot).toBe(expectedRoot);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const indexPath = path.join(expectedRoot, "index.html");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const indexContents = await fs.readFile(indexPath, "utf8");
        expect(indexContents).toContain("OpenClaw Canvas");
      } finally {
        await handler.close();
      }
    });
  });
});
