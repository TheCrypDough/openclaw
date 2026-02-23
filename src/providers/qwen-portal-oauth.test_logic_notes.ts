/*
 * AUTO ANNOTATION
 * File: src/providers/qwen-portal-oauth.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi, afterEach } from "vitest";
import { refreshQwenPortalCredentials } from "./qwen-portal-oauth.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const originalFetch = globalThis.fetch;

afterEach(() => {
  vi.unstubAllGlobals();
  globalThis.fetch = originalFetch;
});

describe("refreshQwenPortalCredentials", () => {
  it("refreshes tokens with a new access token", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: "new-access",
        refresh_token: "new-refresh",
        expires_in: 3600,
      }),
    });
    vi.stubGlobal("fetch", fetchSpy);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await refreshQwenPortalCredentials({
      access: "old-access",
      refresh: "old-refresh",
      expires: Date.now() - 1000,
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://chat.qwen.ai/api/v1/oauth2/token",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(result.access).toBe("new-access");
    expect(result.refresh).toBe("new-refresh");
    expect(result.expires).toBeGreaterThan(Date.now());
  });

  it("keeps refresh token when refresh response omits it", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: "new-access",
        expires_in: 1800,
      }),
    });
    vi.stubGlobal("fetch", fetchSpy);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await refreshQwenPortalCredentials({
      access: "old-access",
      refresh: "old-refresh",
      expires: Date.now() - 1000,
    });

    expect(result.refresh).toBe("old-refresh");
  });

  it("keeps refresh token when response sends an empty refresh token", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: "new-access",
        refresh_token: "",
        expires_in: 1800,
      }),
    });
    vi.stubGlobal("fetch", fetchSpy);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await refreshQwenPortalCredentials({
      access: "old-access",
      refresh: "old-refresh",
      expires: Date.now() - 1000,
    });

    expect(result.refresh).toBe("old-refresh");
  });

  it("errors when refresh response has invalid expires_in", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: "new-access",
        refresh_token: "new-refresh",
        expires_in: 0,
      }),
    });
    vi.stubGlobal("fetch", fetchSpy);

    await expect(
      refreshQwenPortalCredentials({
        access: "old-access",
        refresh: "old-refresh",
        expires: Date.now() - 1000,
      }),
    ).rejects.toThrow("Qwen OAuth refresh response missing or invalid expires_in");
  });

  it("errors when refresh token is invalid", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => "invalid_grant",
    });
    vi.stubGlobal("fetch", fetchSpy);

    await expect(
      refreshQwenPortalCredentials({
        access: "old-access",
        refresh: "old-refresh",
        expires: Date.now() - 1000,
      }),
    ).rejects.toThrow("Qwen OAuth refresh token expired or invalid");
  });
});
