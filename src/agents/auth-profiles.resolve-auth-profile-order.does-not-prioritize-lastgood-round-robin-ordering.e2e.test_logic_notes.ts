/*
 * AUTO ANNOTATION
 * File: src/agents/auth-profiles.resolve-auth-profile-order.does-not-prioritize-lastgood-round-robin-ordering.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { resolveAuthProfileOrder } from "./auth-profiles.js";
import {
  ANTHROPIC_CFG,
  ANTHROPIC_STORE,
} from "./auth-profiles.resolve-auth-profile-order.fixtures.js";
import type { AuthProfileStore } from "./auth-profiles/types.js";

describe("resolveAuthProfileOrder", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const store = ANTHROPIC_STORE;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = ANTHROPIC_CFG;

  it("does not prioritize lastGood over round-robin ordering", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      cfg,
      store: {
        ...store,
        lastGood: { anthropic: "anthropic:work" },
        usageStats: {
          "anthropic:default": { lastUsed: 100 },
          "anthropic:work": { lastUsed: 200 },
        },
      },
      provider: "anthropic",
    });
    expect(order[0]).toBe("anthropic:default");
  });
  it("uses explicit profiles when order is missing", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      cfg,
      store,
      provider: "anthropic",
    });
    expect(order).toEqual(["anthropic:default", "anthropic:work"]);
  });
  it("uses configured order when provided", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      cfg: {
        auth: {
          order: { anthropic: ["anthropic:work", "anthropic:default"] },
          profiles: cfg.auth?.profiles,
        },
      },
      store,
      provider: "anthropic",
    });
    expect(order).toEqual(["anthropic:work", "anthropic:default"]);
  });
  it("prefers store order over config order", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      cfg: {
        auth: {
          order: { anthropic: ["anthropic:default", "anthropic:work"] },
          profiles: cfg.auth?.profiles,
        },
      },
      store: {
        ...store,
        order: { anthropic: ["anthropic:work", "anthropic:default"] },
      },
      provider: "anthropic",
    });
    expect(order).toEqual(["anthropic:work", "anthropic:default"]);
  });
  it("pushes cooldown profiles to the end even with store order", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const now = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      store: {
        ...store,
        order: { anthropic: ["anthropic:default", "anthropic:work"] },
        usageStats: {
          "anthropic:default": { cooldownUntil: now + 60_000 },
          "anthropic:work": { lastUsed: 1 },
        },
      },
      provider: "anthropic",
    });
    expect(order).toEqual(["anthropic:work", "anthropic:default"]);
  });
  it("pushes cooldown profiles to the end even with configured order", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const now = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const order = resolveAuthProfileOrder({
      cfg: {
        auth: {
          order: { anthropic: ["anthropic:default", "anthropic:work"] },
          profiles: cfg.auth?.profiles,
        },
      },
      store: {
        ...store,
        usageStats: {
          "anthropic:default": { cooldownUntil: now + 60_000 },
          "anthropic:work": { lastUsed: 1 },
        },
      },
      provider: "anthropic",
    });
    expect(order).toEqual(["anthropic:work", "anthropic:default"]);
  });
  it("pushes disabled profiles to the end even with store order", () => {
    const now = Date.now();
    const order = resolveAuthProfileOrder({
      store: {
        ...store,
        order: { anthropic: ["anthropic:default", "anthropic:work"] },
        usageStats: {
          "anthropic:default": {
            disabledUntil: now + 60_000,
            disabledReason: "billing",
          },
          "anthropic:work": { lastUsed: 1 },
        },
      },
      provider: "anthropic",
    });
    expect(order).toEqual(["anthropic:work", "anthropic:default"]);
  });
  it("pushes disabled profiles to the end even with configured order", () => {
    const now = Date.now();
    const order = resolveAuthProfileOrder({
      cfg: {
        auth: {
          order: { anthropic: ["anthropic:default", "anthropic:work"] },
          profiles: cfg.auth?.profiles,
        },
      },
      store: {
        ...store,
        usageStats: {
          "anthropic:default": {
            disabledUntil: now + 60_000,
            disabledReason: "billing",
          },
          "anthropic:work": { lastUsed: 1 },
        },
      },
      provider: "anthropic",
    });
    expect(order).toEqual(["anthropic:work", "anthropic:default"]);
  });

  it("mode: oauth config accepts both oauth and token credentials (issue #559)", () => {
    const now = Date.now();
    const storeWithBothTypes: AuthProfileStore = {
      version: 1,
      profiles: {
        "anthropic:oauth-cred": {
          type: "oauth",
          provider: "anthropic",
          access: "access-token",
          refresh: "refresh-token",
          expires: now + 60_000,
        },
        "anthropic:token-cred": {
          type: "token",
          provider: "anthropic",
          token: "just-a-token",
          expires: now + 60_000,
        },
      },
    };

    const orderOauthCred = resolveAuthProfileOrder({
      store: storeWithBothTypes,
      provider: "anthropic",
      cfg: {
        auth: {
          profiles: {
            "anthropic:oauth-cred": { provider: "anthropic", mode: "oauth" },
          },
        },
      },
    });
    expect(orderOauthCred).toContain("anthropic:oauth-cred");

    const orderTokenCred = resolveAuthProfileOrder({
      store: storeWithBothTypes,
      provider: "anthropic",
      cfg: {
        auth: {
          profiles: {
            "anthropic:token-cred": { provider: "anthropic", mode: "oauth" },
          },
        },
      },
    });
    expect(orderTokenCred).toContain("anthropic:token-cred");
  });

  it("mode: token config rejects oauth credentials (issue #559 root cause)", () => {
    const now = Date.now();
    const storeWithOauth: AuthProfileStore = {
      version: 1,
      profiles: {
        "anthropic:oauth-cred": {
          type: "oauth",
          provider: "anthropic",
          access: "access-token",
          refresh: "refresh-token",
          expires: now + 60_000,
        },
      },
    };

    const order = resolveAuthProfileOrder({
      store: storeWithOauth,
      provider: "anthropic",
      cfg: {
        auth: {
          profiles: {
            "anthropic:oauth-cred": { provider: "anthropic", mode: "token" },
          },
        },
      },
    });
    expect(order).not.toContain("anthropic:oauth-cred");
  });
});
