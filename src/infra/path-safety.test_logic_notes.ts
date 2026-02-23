/*
 * AUTO ANNOTATION
 * File: src/infra/path-safety.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isWithinDir, resolveSafeBaseDir } from "./path-safety.js";

describe("path-safety", () => {
  it("resolves safe base dir with trailing separator", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const base = resolveSafeBaseDir("/tmp/demo");
    expect(base.endsWith(path.sep)).toBe(true);
  });

  it("checks directory containment", () => {
    expect(isWithinDir("/tmp/demo", "/tmp/demo")).toBe(true);
    expect(isWithinDir("/tmp/demo", "/tmp/demo/sub/file.txt")).toBe(true);
    expect(isWithinDir("/tmp/demo", "/tmp/demo/../escape.txt")).toBe(false);
  });
});
