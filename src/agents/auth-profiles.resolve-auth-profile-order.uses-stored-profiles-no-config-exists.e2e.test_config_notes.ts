# AUTOPLACEHOLDER_ANNOTATION: src/agents/auth-profiles.resolve-auth-profile-order.uses-stored-profiles-no-config-exists.e2e.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { describe, expect, it } from "vitest";
import { resolveAuthProfileOrder } from "./auth-profiles.js";
import {
  ANTHROPIC_CFG,
  ANTHROPIC_STORE,
} from "./auth-profiles.resolve-auth-profile-order.fixtures.js";

describe("resolveAuthProfileOrder", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const store = ANTHROPIC_STORE;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = ANTHROPIC_CFG;

  it("uses stored profiles when no config exists", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      store,
      provider: "anthropic",
    });
    expect(order).toEqual(["anthropic:default", "anthropic:work"]);
  });
  it("prioritizes preferred profiles", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      cfg,
      store,
      provider: "anthropic",
      preferredProfile: "anthropic:work",
    });
    expect(order[0]).toBe("anthropic:work");
    expect(order).toContain("anthropic:default");
  });
  it("drops explicit order entries that are missing from the store", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      cfg: {
        auth: {
          order: {
            minimax: ["minimax:default", "minimax:prod"],
          },
        },
      },
      store: {
        version: 1,
        profiles: {
          "minimax:prod": {
            type: "api_key",
            provider: "minimax",
            key: "sk-prod",
          },
        },
      },
      provider: "minimax",
    });
    expect(order).toEqual(["minimax:prod"]);
  });
  it("falls back to stored provider profiles when config profile ids drift", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      cfg: {
        auth: {
          profiles: {
            "openai-codex:default": {
              provider: "openai-codex",
              mode: "oauth",
            },
          },
          order: {
            "openai-codex": ["openai-codex:default"],
          },
        },
      },
      store: {
        version: 1,
        profiles: {
          "openai-codex:user@example.com": {
            type: "oauth",
            provider: "openai-codex",
            access: "access-token",
            refresh: "refresh-token",
            expires: Date.now() + 60_000,
          },
        },
      },
      provider: "openai-codex",
    });
    expect(order).toEqual(["openai-codex:user@example.com"]);
  });
  it("does not bypass explicit ids when the configured profile exists but is invalid", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      cfg: {
        auth: {
          profiles: {
            "openai-codex:default": {
              provider: "openai-codex",
              mode: "token",
            },
          },
          order: {
            "openai-codex": ["openai-codex:default"],
          },
        },
      },
      store: {
        version: 1,
        profiles: {
          "openai-codex:default": {
            type: "token",
            provider: "openai-codex",
            token: "expired-token",
            expires: Date.now() - 1_000,
          },
          "openai-codex:user@example.com": {
            type: "oauth",
            provider: "openai-codex",
            access: "access-token",
            refresh: "refresh-token",
            expires: Date.now() + 60_000,
          },
        },
      },
      provider: "openai-codex",
    });
    expect(order).toEqual([]);
  });
  it("drops explicit order entries that belong to another provider", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      cfg: {
        auth: {
          order: {
            minimax: ["openai:default", "minimax:prod"],
          },
        },
      },
      store: {
        version: 1,
        profiles: {
          "openai:default": {
            type: "api_key",
            provider: "openai",
            key: "sk-openai",
          },
          "minimax:prod": {
            type: "api_key",
            provider: "minimax",
            key: "sk-mini",
          },
        },
      },
      provider: "minimax",
    });
    expect(order).toEqual(["minimax:prod"]);
  });
  it("drops token profiles with empty credentials", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      cfg: {
        auth: {
          order: {
            minimax: ["minimax:default"],
          },
        },
      },
      store: {
        version: 1,
        profiles: {
          "minimax:default": {
            type: "token",
            provider: "minimax",
            token: "   ",
          },
        },
      },
      provider: "minimax",
    });
    expect(order).toEqual([]);
  });
  it("drops token profiles that are already expired", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      cfg: {
        auth: {
          order: {
            minimax: ["minimax:default"],
          },
        },
      },
      store: {
        version: 1,
        profiles: {
          "minimax:default": {
            type: "token",
            provider: "minimax",
            token: "sk-minimax",
            expires: Date.now() - 1000,
          },
        },
      },
      provider: "minimax",
    });
    expect(order).toEqual([]);
  });
  it("keeps oauth profiles that can refresh", () => {
    const order = resolveAuthProfileOrder({
      cfg: {
        auth: {
          order: {
            anthropic: ["anthropic:oauth"],
          },
        },
      },
      store: {
        version: 1,
        profiles: {
          "anthropic:oauth": {
            type: "oauth",
            provider: "anthropic",
            access: "",
            refresh: "refresh-token",
            expires: Date.now() - 1000,
          },
        },
      },
      provider: "anthropic",
    });
    expect(order).toEqual(["anthropic:oauth"]);
  });
});
