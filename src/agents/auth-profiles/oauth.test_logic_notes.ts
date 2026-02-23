/*
 * AUTO ANNOTATION
 * File: src/agents/auth-profiles/oauth.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";
import { resolveApiKeyForProfile } from "./oauth.js";
import type { AuthProfileStore } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function cfgFor(profileId: string, provider: string, mode: "api_key" | "token" | "oauth") {
  return {
    auth: {
      profiles: {
        [profileId]: { provider, mode },
      },
    },
  } satisfies OpenClawConfig;
}

describe("resolveApiKeyForProfile config compatibility", () => {
  it("accepts token credentials when config mode is oauth", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const profileId = "anthropic:token";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const store: AuthProfileStore = {
      version: 1,
      profiles: {
        [profileId]: {
          type: "token",
          provider: "anthropic",
          token: "tok-123",
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await resolveApiKeyForProfile({
      cfg: cfgFor(profileId, "anthropic", "oauth"),
      store,
      profileId,
    });
    expect(result).toEqual({
      apiKey: "tok-123",
      provider: "anthropic",
      email: undefined,
    });
  });

  it("rejects token credentials when config mode is api_key", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const profileId = "anthropic:token";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const store: AuthProfileStore = {
      version: 1,
      profiles: {
        [profileId]: {
          type: "token",
          provider: "anthropic",
          token: "tok-123",
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await resolveApiKeyForProfile({
      cfg: cfgFor(profileId, "anthropic", "api_key"),
      store,
      profileId,
    });
    expect(result).toBeNull();
  });

  it("accepts oauth credentials when config mode is token (bidirectional compat)", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const profileId = "anthropic:oauth";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const store: AuthProfileStore = {
      version: 1,
      profiles: {
        [profileId]: {
          type: "oauth",
          provider: "anthropic",
          access: "access-123",
          refresh: "refresh-123",
          expires: Date.now() + 60_000,
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await resolveApiKeyForProfile({
      cfg: cfgFor(profileId, "anthropic", "token"),
      store,
      profileId,
    });
    // token ↔ oauth are bidirectionally compatible bearer-token auth paths.
    expect(result).toEqual({
      apiKey: "access-123",
      provider: "anthropic",
      email: undefined,
    });
  });

  it("rejects credentials when provider does not match config", async () => {
    const profileId = "anthropic:token";
    const store: AuthProfileStore = {
      version: 1,
      profiles: {
        [profileId]: {
          type: "token",
          provider: "anthropic",
          token: "tok-123",
        },
      },
    };

    const result = await resolveApiKeyForProfile({
      cfg: cfgFor(profileId, "openai", "token"),
      store,
      profileId,
    });
    expect(result).toBeNull();
  });
});

describe("resolveApiKeyForProfile token expiry handling", () => {
  it("returns null for expired token credentials", async () => {
    const profileId = "anthropic:token-expired";
    const store: AuthProfileStore = {
      version: 1,
      profiles: {
        [profileId]: {
          type: "token",
          provider: "anthropic",
          token: "tok-expired",
          expires: Date.now() - 1_000,
        },
      },
    };

    const result = await resolveApiKeyForProfile({
      cfg: cfgFor(profileId, "anthropic", "token"),
      store,
      profileId,
    });
    expect(result).toBeNull();
  });

  it("accepts token credentials when expires is 0", async () => {
    const profileId = "anthropic:token-no-expiry";
    const store: AuthProfileStore = {
      version: 1,
      profiles: {
        [profileId]: {
          type: "token",
          provider: "anthropic",
          token: "tok-123",
          expires: 0,
        },
      },
    };

    const result = await resolveApiKeyForProfile({
      cfg: cfgFor(profileId, "anthropic", "token"),
      store,
      profileId,
    });
    expect(result).toEqual({
      apiKey: "tok-123",
      provider: "anthropic",
      email: undefined,
    });
  });
});
