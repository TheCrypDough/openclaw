/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/probe.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MSTeamsConfig } from "openclaw/plugin-sdk";
import { describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const hostMockState = vi.hoisted(() => ({
  tokenError: null as Error | null,
}));

vi.mock("@microsoft/agents-hosting", () => ({
  getAuthConfigWithDefaults: (cfg: unknown) => cfg,
  MsalTokenProvider: class {
    async getAccessToken() {
      if (hostMockState.tokenError) {
        throw hostMockState.tokenError;
      }
      return "token";
    }
  },
}));

import { probeMSTeams } from "./probe.js";

describe("msteams probe", () => {
  it("returns an error when credentials are missing", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { enabled: true } as unknown as MSTeamsConfig;
    await expect(probeMSTeams(cfg)).resolves.toMatchObject({
      ok: false,
    });
  });

  it("validates credentials by acquiring a token", async () => {
    hostMockState.tokenError = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      enabled: true,
      appId: "app",
      appPassword: "pw",
      tenantId: "tenant",
    } as unknown as MSTeamsConfig;
    await expect(probeMSTeams(cfg)).resolves.toMatchObject({
      ok: true,
      appId: "app",
    });
  });

  it("returns a helpful error when token acquisition fails", async () => {
    hostMockState.tokenError = new Error("bad creds");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      enabled: true,
      appId: "app",
      appPassword: "pw",
      tenantId: "tenant",
    } as unknown as MSTeamsConfig;
    await expect(probeMSTeams(cfg)).resolves.toMatchObject({
      ok: false,
      appId: "app",
      error: "bad creds",
    });
  });
});
