/*
 * AUTO ANNOTATION
 * File: src/commands/models.auth.provider-resolution.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { ProviderPlugin } from "../plugins/types.js";
import { resolveRequestedLoginProviderOrThrow } from "./models/auth.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeProvider(params: { id: string; label?: string; aliases?: string[] }): ProviderPlugin {
  return {
    id: params.id,
    label: params.label ?? params.id,
    aliases: params.aliases,
    auth: [],
  };
}

describe("resolveRequestedLoginProviderOrThrow", () => {
  it("returns null when no provider was requested", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const providers = [makeProvider({ id: "google-antigravity" })];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveRequestedLoginProviderOrThrow(providers, undefined);
    expect(result).toBeNull();
  });

  it("resolves requested provider by id", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const providers = [
      makeProvider({ id: "google-antigravity" }),
      makeProvider({ id: "google-gemini-cli" }),
    ];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveRequestedLoginProviderOrThrow(providers, "google-antigravity");
    expect(result?.id).toBe("google-antigravity");
  });

  it("resolves requested provider by alias", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const providers = [makeProvider({ id: "google-antigravity", aliases: ["antigravity"] })];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveRequestedLoginProviderOrThrow(providers, "antigravity");
    expect(result?.id).toBe("google-antigravity");
  });

  it("throws when requested provider is not loaded", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const providers = [
      makeProvider({ id: "google-gemini-cli" }),
      makeProvider({ id: "qwen-portal" }),
    ];

    expect(() =>
      resolveRequestedLoginProviderOrThrow(providers, "google-antigravity"),
    ).toThrowError(
      'Unknown provider "google-antigravity". Loaded providers: google-gemini-cli, qwen-portal. Verify plugins via `openclaw plugins list --json`.',
    );
  });
});
