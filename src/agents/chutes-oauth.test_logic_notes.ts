/*
 * AUTO ANNOTATION
 * File: src/agents/chutes-oauth.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { generateChutesPkce, parseOAuthCallbackInput } from "./chutes-oauth.js";

describe("parseOAuthCallbackInput", () => {
  it("rejects code-only input (state required)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = parseOAuthCallbackInput("abc123", "expected-state");
    expect(parsed).toEqual({
      error: "Paste the full redirect URL (must include code + state).",
    });
  });

  it("accepts full redirect URL when state matches", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = parseOAuthCallbackInput(
      "http://127.0.0.1:1456/oauth-callback?code=abc123&state=expected-state",
      "expected-state",
    );
    expect(parsed).toEqual({ code: "abc123", state: "expected-state" });
  });

  it("accepts querystring-only input when state matches", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = parseOAuthCallbackInput("code=abc123&state=expected-state", "expected-state");
    expect(parsed).toEqual({ code: "abc123", state: "expected-state" });
  });

  it("rejects missing state", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = parseOAuthCallbackInput(
      "http://127.0.0.1:1456/oauth-callback?code=abc123",
      "expected-state",
    );
    expect(parsed).toEqual({
      error: "Missing 'state' parameter. Paste the full redirect URL.",
    });
  });

  it("rejects state mismatch", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = parseOAuthCallbackInput(
      "http://127.0.0.1:1456/oauth-callback?code=abc123&state=evil",
      "expected-state",
    );
    expect(parsed).toEqual({
      error: "OAuth state mismatch - possible CSRF attack. Please retry login.",
    });
  });
});

describe("generateChutesPkce", () => {
  it("returns verifier and challenge", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pkce = generateChutesPkce();
    expect(pkce.verifier).toMatch(/^[0-9a-f]{64}$/);
    expect(pkce.challenge).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});
