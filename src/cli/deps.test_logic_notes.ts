/*
 * AUTO ANNOTATION
 * File: src/cli/deps.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDefaultDeps } from "./deps.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const moduleLoads = vi.hoisted(() => ({
  whatsapp: vi.fn(),
  telegram: vi.fn(),
  discord: vi.fn(),
  slack: vi.fn(),
  signal: vi.fn(),
  imessage: vi.fn(),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const sendFns = vi.hoisted(() => ({
  whatsapp: vi.fn(async () => ({ messageId: "w1", toJid: "whatsapp:1" })),
  telegram: vi.fn(async () => ({ messageId: "t1", chatId: "telegram:1" })),
  discord: vi.fn(async () => ({ messageId: "d1", channelId: "discord:1" })),
  slack: vi.fn(async () => ({ messageId: "s1", channelId: "slack:1" })),
  signal: vi.fn(async () => ({ messageId: "sg1", conversationId: "signal:1" })),
  imessage: vi.fn(async () => ({ messageId: "i1", chatId: "imessage:1" })),
}));

vi.mock("../channels/web/index.js", () => {
  moduleLoads.whatsapp();
  return { sendMessageWhatsApp: sendFns.whatsapp };
});

vi.mock("../telegram/send.js", () => {
  moduleLoads.telegram();
  return { sendMessageTelegram: sendFns.telegram };
});

vi.mock("../discord/send.js", () => {
  moduleLoads.discord();
  return { sendMessageDiscord: sendFns.discord };
});

vi.mock("../slack/send.js", () => {
  moduleLoads.slack();
  return { sendMessageSlack: sendFns.slack };
});

vi.mock("../signal/send.js", () => {
  moduleLoads.signal();
  return { sendMessageSignal: sendFns.signal };
});

vi.mock("../imessage/send.js", () => {
  moduleLoads.imessage();
  return { sendMessageIMessage: sendFns.imessage };
});

describe("createDefaultDeps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not load provider modules until a dependency is used", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const deps = createDefaultDeps();

    expect(moduleLoads.whatsapp).not.toHaveBeenCalled();
    expect(moduleLoads.telegram).not.toHaveBeenCalled();
    expect(moduleLoads.discord).not.toHaveBeenCalled();
    expect(moduleLoads.slack).not.toHaveBeenCalled();
    expect(moduleLoads.signal).not.toHaveBeenCalled();
    expect(moduleLoads.imessage).not.toHaveBeenCalled();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sendTelegram = deps.sendMessageTelegram as unknown as (
      ...args: unknown[]
    ) => Promise<unknown>;
    await sendTelegram("chat", "hello", { verbose: false });

    expect(moduleLoads.telegram).toHaveBeenCalledTimes(1);
    expect(sendFns.telegram).toHaveBeenCalledTimes(1);
    expect(moduleLoads.whatsapp).not.toHaveBeenCalled();
    expect(moduleLoads.discord).not.toHaveBeenCalled();
    expect(moduleLoads.slack).not.toHaveBeenCalled();
    expect(moduleLoads.signal).not.toHaveBeenCalled();
    expect(moduleLoads.imessage).not.toHaveBeenCalled();
  });

  it("reuses module cache after first dynamic import", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const deps = createDefaultDeps();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sendDiscord = deps.sendMessageDiscord as unknown as (
      ...args: unknown[]
    ) => Promise<unknown>;

    await sendDiscord("channel", "first", { verbose: false });
    await sendDiscord("channel", "second", { verbose: false });

    expect(moduleLoads.discord).toHaveBeenCalledTimes(1);
    expect(sendFns.discord).toHaveBeenCalledTimes(2);
  });
});
