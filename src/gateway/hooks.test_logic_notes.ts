/*
 * AUTO ANNOTATION
 * File: src/gateway/hooks.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { IncomingMessage } from "node:http";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import type { ChannelPlugin } from "../channels/plugins/types.js";
import type { OpenClawConfig } from "../config/config.js";
import { setActivePluginRegistry } from "../plugins/runtime.js";
import { createTestRegistry } from "../test-utils/channel-plugins.js";
import { createIMessageTestPlugin } from "../test-utils/imessage-test-plugin.js";
import {
  extractHookToken,
  isHookAgentAllowed,
  resolveHookSessionKey,
  resolveHookTargetAgentId,
  normalizeAgentPayload,
  normalizeWakePayload,
  resolveHooksConfig,
} from "./hooks.js";

describe("gateway hooks helpers", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolveHooksConfigOrThrow = (cfg: OpenClawConfig) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = resolveHooksConfig(cfg);
    expect(resolved).not.toBeNull();
    if (!resolved) {
      throw new Error("hooks config missing");
    }
    return resolved;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const buildHookAgentConfig = (allowedAgentIds: string[]) =>
    ({
      hooks: {
        enabled: true,
        token: "secret",
        allowedAgentIds,
      },
      agents: {
        list: [{ id: "main", default: true }, { id: "hooks" }],
      },
    }) as OpenClawConfig;

  beforeEach(() => {
    setActivePluginRegistry(emptyRegistry);
  });

  afterEach(() => {
    setActivePluginRegistry(emptyRegistry);
  });
  test("resolveHooksConfig normalizes paths + requires token", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const base = {
      hooks: {
        enabled: true,
        token: "secret",
        path: "hooks///",
      },
    } as OpenClawConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = resolveHooksConfig(base);
    expect(resolved?.basePath).toBe("/hooks");
    expect(resolved?.token).toBe("secret");
    expect(resolved?.sessionPolicy.allowRequestSessionKey).toBe(false);
  });

  test("resolveHooksConfig rejects root path", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      hooks: { enabled: true, token: "x", path: "/" },
    } as OpenClawConfig;
    expect(() => resolveHooksConfig(cfg)).toThrow("hooks.path may not be '/'");
  });

  test("extractHookToken prefers bearer > header", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const req = {
      headers: {
        authorization: "Bearer top",
        "x-openclaw-token": "header",
      },
    } as unknown as IncomingMessage;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result1 = extractHookToken(req);
    expect(result1).toBe("top");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const req2 = {
      headers: { "x-openclaw-token": "header" },
    } as unknown as IncomingMessage;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result2 = extractHookToken(req2);
    expect(result2).toBe("header");

    const req3 = { headers: {} } as unknown as IncomingMessage;
    const result3 = extractHookToken(req3);
    expect(result3).toBeUndefined();
  });

  test("normalizeWakePayload trims + validates", () => {
    expect(normalizeWakePayload({ text: "  hi " })).toEqual({
      ok: true,
      value: { text: "hi", mode: "now" },
    });
    expect(normalizeWakePayload({ text: "  ", mode: "now" }).ok).toBe(false);
  });

  test("normalizeAgentPayload defaults + validates channel", () => {
    const ok = normalizeAgentPayload({ message: "hello" });
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.value.sessionKey).toBeUndefined();
      expect(ok.value.channel).toBe("last");
      expect(ok.value.name).toBe("Hook");
      expect(ok.value.deliver).toBe(true);
    }

    const explicitNoDeliver = normalizeAgentPayload({ message: "hello", deliver: false });
    expect(explicitNoDeliver.ok).toBe(true);
    if (explicitNoDeliver.ok) {
      expect(explicitNoDeliver.value.deliver).toBe(false);
    }

    setActivePluginRegistry(
      createTestRegistry([
        {
          pluginId: "imessage",
          source: "test",
          plugin: createIMessageTestPlugin(),
        },
      ]),
    );
    const imsg = normalizeAgentPayload({ message: "yo", channel: "imsg" });
    expect(imsg.ok).toBe(true);
    if (imsg.ok) {
      expect(imsg.value.channel).toBe("imessage");
    }

    setActivePluginRegistry(
      createTestRegistry([
        {
          pluginId: "msteams",
          source: "test",
          plugin: createMSTeamsPlugin({ aliases: ["teams"] }),
        },
      ]),
    );
    const teams = normalizeAgentPayload({ message: "yo", channel: "teams" });
    expect(teams.ok).toBe(true);
    if (teams.ok) {
      expect(teams.value.channel).toBe("msteams");
    }

    const bad = normalizeAgentPayload({ message: "yo", channel: "sms" });
    expect(bad.ok).toBe(false);
  });

  test("normalizeAgentPayload passes agentId", () => {
    const ok = normalizeAgentPayload({ message: "hello", agentId: "hooks" });
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.value.agentId).toBe("hooks");
    }

    const noAgent = normalizeAgentPayload({ message: "hello" });
    expect(noAgent.ok).toBe(true);
    if (noAgent.ok) {
      expect(noAgent.value.agentId).toBeUndefined();
    }
  });

  test("resolveHookTargetAgentId falls back to default for unknown agent ids", () => {
    const cfg = {
      hooks: { enabled: true, token: "secret" },
      agents: {
        list: [{ id: "main", default: true }, { id: "hooks" }],
      },
    } as OpenClawConfig;
    const resolved = resolveHooksConfig(cfg);
    expect(resolved).not.toBeNull();
    if (!resolved) {
      return;
    }
    expect(resolveHookTargetAgentId(resolved, "hooks")).toBe("hooks");
    expect(resolveHookTargetAgentId(resolved, "missing-agent")).toBe("main");
    expect(resolveHookTargetAgentId(resolved, undefined)).toBeUndefined();
  });

  test("isHookAgentAllowed honors hooks.allowedAgentIds for explicit routing", () => {
    const resolved = resolveHooksConfigOrThrow(buildHookAgentConfig(["hooks"]));
    expect(isHookAgentAllowed(resolved, undefined)).toBe(true);
    expect(isHookAgentAllowed(resolved, "hooks")).toBe(true);
    expect(isHookAgentAllowed(resolved, "missing-agent")).toBe(false);
  });

  test("isHookAgentAllowed treats empty allowlist as deny-all for explicit agentId", () => {
    const resolved = resolveHooksConfigOrThrow(buildHookAgentConfig([]));
    expect(isHookAgentAllowed(resolved, undefined)).toBe(true);
    expect(isHookAgentAllowed(resolved, "hooks")).toBe(false);
    expect(isHookAgentAllowed(resolved, "main")).toBe(false);
  });

  test("isHookAgentAllowed treats wildcard allowlist as allow-all", () => {
    const resolved = resolveHooksConfigOrThrow(buildHookAgentConfig(["*"]));
    expect(isHookAgentAllowed(resolved, undefined)).toBe(true);
    expect(isHookAgentAllowed(resolved, "hooks")).toBe(true);
    expect(isHookAgentAllowed(resolved, "missing-agent")).toBe(true);
  });

  test("resolveHookSessionKey disables request sessionKey by default", () => {
    const cfg = {
      hooks: { enabled: true, token: "secret" },
    } as OpenClawConfig;
    const resolved = resolveHooksConfig(cfg);
    expect(resolved).not.toBeNull();
    if (!resolved) {
      return;
    }
    const denied = resolveHookSessionKey({
      hooksConfig: resolved,
      source: "request",
      sessionKey: "agent:main:dm:u99999",
    });
    expect(denied.ok).toBe(false);
  });

  test("resolveHookSessionKey allows request sessionKey when explicitly enabled", () => {
    const cfg = {
      hooks: { enabled: true, token: "secret", allowRequestSessionKey: true },
    } as OpenClawConfig;
    const resolved = resolveHooksConfig(cfg);
    expect(resolved).not.toBeNull();
    if (!resolved) {
      return;
    }
    const allowed = resolveHookSessionKey({
      hooksConfig: resolved,
      source: "request",
      sessionKey: "hook:manual",
    });
    expect(allowed).toEqual({ ok: true, value: "hook:manual" });
  });

  test("resolveHookSessionKey enforces allowed prefixes", () => {
    const cfg = {
      hooks: {
        enabled: true,
        token: "secret",
        allowRequestSessionKey: true,
        allowedSessionKeyPrefixes: ["hook:"],
      },
    } as OpenClawConfig;
    const resolved = resolveHooksConfig(cfg);
    expect(resolved).not.toBeNull();
    if (!resolved) {
      return;
    }

    const blocked = resolveHookSessionKey({
      hooksConfig: resolved,
      source: "request",
      sessionKey: "agent:main:main",
    });
    expect(blocked.ok).toBe(false);

    const allowed = resolveHookSessionKey({
      hooksConfig: resolved,
      source: "mapping",
      sessionKey: "hook:gmail:1",
    });
    expect(allowed).toEqual({ ok: true, value: "hook:gmail:1" });
  });

  test("resolveHookSessionKey uses defaultSessionKey when request key is absent", () => {
    const cfg = {
      hooks: {
        enabled: true,
        token: "secret",
        defaultSessionKey: "hook:ingress",
      },
    } as OpenClawConfig;
    const resolved = resolveHooksConfig(cfg);
    expect(resolved).not.toBeNull();
    if (!resolved) {
      return;
    }

    const resolvedKey = resolveHookSessionKey({
      hooksConfig: resolved,
      source: "request",
    });
    expect(resolvedKey).toEqual({ ok: true, value: "hook:ingress" });
  });

  test("resolveHooksConfig validates defaultSessionKey and generated fallback against prefixes", () => {
    expect(() =>
      resolveHooksConfig({
        hooks: {
          enabled: true,
          token: "secret",
          defaultSessionKey: "agent:main:main",
          allowedSessionKeyPrefixes: ["hook:"],
        },
      } as OpenClawConfig),
    ).toThrow("hooks.defaultSessionKey must match hooks.allowedSessionKeyPrefixes");

    expect(() =>
      resolveHooksConfig({
        hooks: {
          enabled: true,
          token: "secret",
          allowedSessionKeyPrefixes: ["agent:"],
        },
      } as OpenClawConfig),
    ).toThrow(
      "hooks.allowedSessionKeyPrefixes must include 'hook:' when hooks.defaultSessionKey is unset",
    );
  });
});

const emptyRegistry = createTestRegistry([]);

const createMSTeamsPlugin = (params: { aliases?: string[] }): ChannelPlugin => ({
  id: "msteams",
  meta: {
    id: "msteams",
    label: "Microsoft Teams",
    selectionLabel: "Microsoft Teams (Bot Framework)",
    docsPath: "/channels/msteams",
    blurb: "Bot Framework; enterprise support.",
    aliases: params.aliases,
  },
  capabilities: { chatTypes: ["direct"] },
  config: {
    listAccountIds: () => [],
    resolveAccount: () => ({}),
  },
});
