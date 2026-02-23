/*
 * AUTO ANNOTATION
 * File: src/test-utils/channel-plugins.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createChannelTestPluginBase, createOutboundTestPlugin } from "./channel-plugins.js";

describe("createChannelTestPluginBase", () => {
  it("builds a plugin base with defaults", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {} as never;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const base = createChannelTestPluginBase({ id: "telegram", label: "Telegram" });
    expect(base.id).toBe("telegram");
    expect(base.meta.label).toBe("Telegram");
    expect(base.meta.selectionLabel).toBe("Telegram");
    expect(base.meta.docsPath).toBe("/channels/telegram");
    expect(base.capabilities.chatTypes).toEqual(["direct"]);
    expect(base.config.listAccountIds(cfg)).toEqual(["default"]);
    expect(base.config.resolveAccount(cfg)).toEqual({});
  });

  it("honors config and metadata overrides", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {} as never;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const base = createChannelTestPluginBase({
      id: "discord",
      label: "Discord Bot",
      docsPath: "/custom/discord",
      capabilities: { chatTypes: ["group"] },
      config: {
        listAccountIds: () => ["acct-1"],
        isConfigured: async () => true,
      },
    });
    expect(base.meta.docsPath).toBe("/custom/discord");
    expect(base.capabilities.chatTypes).toEqual(["group"]);
    expect(base.config.listAccountIds(cfg)).toEqual(["acct-1"]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const account = base.config.resolveAccount(cfg);
    await expect(base.config.isConfigured?.(account, cfg)).resolves.toBe(true);
  });
});

describe("createOutboundTestPlugin", () => {
  it("keeps outbound test plugin account list behavior", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {} as never;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const plugin = createOutboundTestPlugin({
      id: "signal",
      outbound: {
        deliveryMode: "direct",
        resolveTarget: () => ({ ok: true, to: "target" }),
        sendText: async () => ({ channel: "signal", messageId: "m1" }),
      },
    });
    expect(plugin.config.listAccountIds(cfg)).toEqual([]);
  });
});
