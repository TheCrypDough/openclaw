/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/actions/limits.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { resolveMatrixActionLimit } from "./limits.js";

describe("resolveMatrixActionLimit", () => {
  it("uses fallback for non-finite values", () => {
    expect(resolveMatrixActionLimit(undefined, 20)).toBe(20);
    expect(resolveMatrixActionLimit(Number.NaN, 20)).toBe(20);
  });

  it("normalizes finite numbers to positive integers", () => {
    expect(resolveMatrixActionLimit(7.9, 20)).toBe(7);
    expect(resolveMatrixActionLimit(0, 20)).toBe(1);
    expect(resolveMatrixActionLimit(-3, 20)).toBe(1);
  });
});
