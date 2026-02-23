/*
 * AUTO ANNOTATION
 * File: src/scripts/canvas-a2ui-copy.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { copyA2uiAssets } from "../../scripts/canvas-a2ui-copy.js";

describe("canvas a2ui copy", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function withA2uiFixture(run: (dir: string) => Promise<void>) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-a2ui-"));
    try {
      await run(dir);
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  }

  it("throws a helpful error when assets are missing", async () => {
    await withA2uiFixture(async (dir) => {
      await expect(copyA2uiAssets({ srcDir: dir, outDir: path.join(dir, "out") })).rejects.toThrow(
        'Run "pnpm canvas:a2ui:bundle"',
      );
    });
  });

  it("skips missing assets when OPENCLAW_A2UI_SKIP_MISSING=1", async () => {
    await withA2uiFixture(async (dir) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const previous = process.env.OPENCLAW_A2UI_SKIP_MISSING;
      process.env.OPENCLAW_A2UI_SKIP_MISSING = "1";
      try {
        await expect(
          copyA2uiAssets({ srcDir: dir, outDir: path.join(dir, "out") }),
        ).resolves.toBeUndefined();
      } finally {
        if (previous === undefined) {
          delete process.env.OPENCLAW_A2UI_SKIP_MISSING;
        } else {
          process.env.OPENCLAW_A2UI_SKIP_MISSING = previous;
        }
      }
    });
  });

  it("copies bundled assets to dist", async () => {
    await withA2uiFixture(async (dir) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const srcDir = path.join(dir, "src");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const outDir = path.join(dir, "dist");
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(path.join(srcDir, "index.html"), "<html></html>", "utf8");
      await fs.writeFile(path.join(srcDir, "a2ui.bundle.js"), "console.log(1);", "utf8");

      await copyA2uiAssets({ srcDir, outDir });

      await expect(fs.stat(path.join(outDir, "index.html"))).resolves.toBeTruthy();
      await expect(fs.stat(path.join(outDir, "a2ui.bundle.js"))).resolves.toBeTruthy();
    });
  });
});
