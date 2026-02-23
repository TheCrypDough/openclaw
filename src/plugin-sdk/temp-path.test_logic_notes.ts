/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/temp-path.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildRandomTempFilePath, withTempDownloadPath } from "./temp-path.js";

describe("buildRandomTempFilePath", () => {
  it("builds deterministic paths when now/uuid are provided", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = buildRandomTempFilePath({
      prefix: "line-media",
      extension: ".jpg",
      tmpDir: "/tmp",
      now: 123,
      uuid: "abc",
    });
    expect(result).toBe(path.join("/tmp", "line-media-123-abc.jpg"));
  });

  it("sanitizes prefix and extension to avoid path traversal segments", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = buildRandomTempFilePath({
      prefix: "../../line/../media",
      extension: "/../.jpg",
      now: 123,
      uuid: "abc",
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tmpRoot = path.resolve(os.tmpdir());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = path.resolve(result);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rel = path.relative(tmpRoot, resolved);
    expect(rel === ".." || rel.startsWith(`..${path.sep}`)).toBe(false);
    expect(path.basename(result)).toBe("line-media-123-abc.jpg");
    expect(result).not.toContain("..");
  });
});

describe("withTempDownloadPath", () => {
  it("creates a temp path under tmp dir and cleans up the temp directory", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let capturedPath = "";
    await withTempDownloadPath(
      {
        prefix: "line-media",
      },
      async (tmpPath) => {
        capturedPath = tmpPath;
        await fs.writeFile(tmpPath, "ok");
      },
    );

    expect(capturedPath).toContain(path.join(os.tmpdir(), "line-media-"));
    await expect(fs.stat(capturedPath)).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("sanitizes prefix and fileName", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let capturedPath = "";
    await withTempDownloadPath(
      {
        prefix: "../../line/../media",
        fileName: "../../evil.bin",
      },
      async (tmpPath) => {
        capturedPath = tmpPath;
      },
    );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tmpRoot = path.resolve(os.tmpdir());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = path.resolve(capturedPath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rel = path.relative(tmpRoot, resolved);
    expect(rel === ".." || rel.startsWith(`..${path.sep}`)).toBe(false);
    expect(path.basename(capturedPath)).toBe("evil.bin");
    expect(capturedPath).not.toContain("..");
  });
});
