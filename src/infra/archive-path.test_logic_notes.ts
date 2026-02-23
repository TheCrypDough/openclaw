/*
 * AUTO ANNOTATION
 * File: src/infra/archive-path.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  resolveArchiveOutputPath,
  stripArchivePath,
  validateArchiveEntryPath,
} from "./archive-path.js";

describe("archive path helpers", () => {
  it("uses custom escape labels in traversal errors", () => {
    expect(() =>
      validateArchiveEntryPath("../escape.txt", {
        escapeLabel: "targetDir",
      }),
    ).toThrow("archive entry escapes targetDir: ../escape.txt");
  });

  it("preserves strip-induced traversal for follow-up validation", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stripped = stripArchivePath("a/../escape.txt", 1);
    expect(stripped).toBe("../escape.txt");
    expect(() =>
      validateArchiveEntryPath(stripped ?? "", {
        escapeLabel: "targetDir",
      }),
    ).toThrow("archive entry escapes targetDir: ../escape.txt");
  });

  it("keeps resolved output paths inside the root", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rootDir = path.join(path.sep, "tmp", "archive-root");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const safe = resolveArchiveOutputPath({
      rootDir,
      relPath: "sub/file.txt",
      originalPath: "sub/file.txt",
    });
    expect(safe).toBe(path.resolve(rootDir, "sub/file.txt"));

    expect(() =>
      resolveArchiveOutputPath({
        rootDir,
        relPath: "../escape.txt",
        originalPath: "../escape.txt",
        escapeLabel: "targetDir",
      }),
    ).toThrow("archive entry escapes targetDir: ../escape.txt");
  });
});
