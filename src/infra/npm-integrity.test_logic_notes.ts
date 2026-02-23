/*
 * AUTO ANNOTATION
 * File: src/infra/npm-integrity.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import {
  resolveNpmIntegrityDrift,
  resolveNpmIntegrityDriftWithDefaultMessage,
} from "./npm-integrity.js";

describe("resolveNpmIntegrityDrift", () => {
  it("returns proceed=true when integrity is missing or unchanged", async () => {
    await expect(
      resolveNpmIntegrityDrift({
        spec: "@openclaw/test@1.0.0",
        expectedIntegrity: "sha512-same",
        resolution: { integrity: "sha512-same", resolvedAt: "2026-01-01T00:00:00.000Z" },
        createPayload: () => "unused",
      }),
    ).resolves.toEqual({ proceed: true });

    await expect(
      resolveNpmIntegrityDrift({
        spec: "@openclaw/test@1.0.0",
        expectedIntegrity: "sha512-same",
        resolution: { resolvedAt: "2026-01-01T00:00:00.000Z" },
        createPayload: () => "unused",
      }),
    ).resolves.toEqual({ proceed: true });
  });

  it("uses callback on integrity drift", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onIntegrityDrift = vi.fn(async () => false);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await resolveNpmIntegrityDrift({
      spec: "@openclaw/test@1.0.0",
      expectedIntegrity: "sha512-old",
      resolution: {
        integrity: "sha512-new",
        resolvedAt: "2026-01-01T00:00:00.000Z",
      },
      createPayload: ({ expectedIntegrity, actualIntegrity }) => ({
        expectedIntegrity,
        actualIntegrity,
      }),
      onIntegrityDrift,
    });

    expect(onIntegrityDrift).toHaveBeenCalledWith({
      expectedIntegrity: "sha512-old",
      actualIntegrity: "sha512-new",
    });
    expect(result.proceed).toBe(false);
    expect(result.integrityDrift).toEqual({
      expectedIntegrity: "sha512-old",
      actualIntegrity: "sha512-new",
    });
  });

  it("warns by default when no callback is provided", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const warn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await resolveNpmIntegrityDrift({
      spec: "@openclaw/test@1.0.0",
      expectedIntegrity: "sha512-old",
      resolution: {
        integrity: "sha512-new",
        resolvedAt: "2026-01-01T00:00:00.000Z",
      },
      createPayload: ({ spec }) => ({ spec }),
      warn,
    });

    expect(warn).toHaveBeenCalledWith({ spec: "@openclaw/test@1.0.0" });
    expect(result.proceed).toBe(true);
  });

  it("formats default warning and abort error messages", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const warn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const warningResult = await resolveNpmIntegrityDriftWithDefaultMessage({
      spec: "@openclaw/test@1.0.0",
      expectedIntegrity: "sha512-old",
      resolution: {
        integrity: "sha512-new",
        resolvedSpec: "@openclaw/test@1.0.0",
        resolvedAt: "2026-01-01T00:00:00.000Z",
      },
      warn,
    });
    expect(warningResult.error).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      "Integrity drift detected for @openclaw/test@1.0.0: expected sha512-old, got sha512-new",
    );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const abortResult = await resolveNpmIntegrityDriftWithDefaultMessage({
      spec: "@openclaw/test@1.0.0",
      expectedIntegrity: "sha512-old",
      resolution: {
        integrity: "sha512-new",
        resolvedSpec: "@openclaw/test@1.0.0",
        resolvedAt: "2026-01-01T00:00:00.000Z",
      },
      onIntegrityDrift: async () => false,
    });
    expect(abortResult.error).toBe(
      "aborted: npm package integrity drift detected for @openclaw/test@1.0.0",
    );
  });
});
