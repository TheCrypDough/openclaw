/*
 * AUTO ANNOTATION
 * File: src/config/runtime-overrides.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  applyConfigOverrides,
  getConfigOverrides,
  resetConfigOverrides,
  setConfigOverride,
  unsetConfigOverride,
} from "./runtime-overrides.js";
import type { OpenClawConfig } from "./types.js";

describe("runtime overrides", () => {
  beforeEach(() => {
    resetConfigOverrides();
  });

  it("sets and applies nested overrides", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      messages: { responsePrefix: "[openclaw]" },
    } as OpenClawConfig;
    setConfigOverride("messages.responsePrefix", "[debug]");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const next = applyConfigOverrides(cfg);
    expect(next.messages?.responsePrefix).toBe("[debug]");
  });

  it("merges object overrides without clobbering siblings", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      channels: { whatsapp: { dmPolicy: "pairing", allowFrom: ["+1"] } },
    } as OpenClawConfig;
    setConfigOverride("channels.whatsapp.dmPolicy", "open");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const next = applyConfigOverrides(cfg);
    expect(next.channels?.whatsapp?.dmPolicy).toBe("open");
    expect(next.channels?.whatsapp?.allowFrom).toEqual(["+1"]);
  });

  it("unsets overrides and prunes empty branches", () => {
    setConfigOverride("channels.whatsapp.dmPolicy", "open");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const removed = unsetConfigOverride("channels.whatsapp.dmPolicy");
    expect(removed.ok).toBe(true);
    expect(removed.removed).toBe(true);
    expect(Object.keys(getConfigOverrides()).length).toBe(0);
  });

  it("rejects prototype pollution paths", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const attempts = ["__proto__.polluted", "constructor.polluted", "prototype.polluted"];
    for (const path of attempts) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = setConfigOverride(path, true);
      expect(result.ok).toBe(false);
      expect(Object.keys(getConfigOverrides()).length).toBe(0);
    }
  });

  it("blocks __proto__ keys inside override object values", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { commands: {} } as OpenClawConfig;
    setConfigOverride("commands", JSON.parse('{"__proto__":{"bash":true}}'));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const next = applyConfigOverrides(cfg);
    expect(next.commands?.bash).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(next.commands ?? {}, "bash")).toBe(false);
  });

  it("blocks constructor/prototype keys inside override object values", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { commands: {} } as OpenClawConfig;
    setConfigOverride("commands", JSON.parse('{"constructor":{"prototype":{"bash":true}}}'));

    const next = applyConfigOverrides(cfg);
    expect(next.commands?.bash).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(next.commands ?? {}, "bash")).toBe(false);
  });

  it("sanitizes blocked object keys when writing overrides", () => {
    setConfigOverride("commands", JSON.parse('{"__proto__":{"bash":true},"debug":true}'));

    expect(getConfigOverrides()).toEqual({
      commands: {
        debug: true,
      },
    });
  });
});
