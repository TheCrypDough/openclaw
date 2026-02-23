/*
 * AUTO ANNOTATION
 * File: extensions/shared/resolve-target-test-helpers.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { expect, it } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ResolveTargetMode = "explicit" | "implicit" | "heartbeat";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ResolveTargetResult = {
  ok: boolean;
  to?: string;
  error?: unknown;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ResolveTargetFn = (params: {
  to?: string;
  mode: ResolveTargetMode;
  allowFrom: string[];
}) => ResolveTargetResult;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function installCommonResolveTargetErrorCases(params: {
  resolveTarget: ResolveTargetFn;
  implicitAllowFrom: string[];
}) {
  const { resolveTarget, implicitAllowFrom } = params;

  it("should error on normalization failure with allowlist (implicit mode)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveTarget({
      to: "invalid-target",
      mode: "implicit",
      allowFrom: implicitAllowFrom,
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should error when no target provided with allowlist", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveTarget({
      to: undefined,
      mode: "implicit",
      allowFrom: implicitAllowFrom,
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should error when no target and no allowlist", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveTarget({
      to: undefined,
      mode: "explicit",
      allowFrom: [],
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should handle whitespace-only target", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveTarget({
      to: "   ",
      mode: "explicit",
      allowFrom: [],
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });
}
