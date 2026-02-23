/*
 * AUTO ANNOTATION
 * File: extensions/feishu/src/bot.stripBotMention.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { stripBotMention, type FeishuMessageEvent } from "./bot.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type Mentions = FeishuMessageEvent["message"]["mentions"];

describe("stripBotMention", () => {
  it("returns original text when mentions are missing", () => {
    expect(stripBotMention("hello world", undefined)).toBe("hello world");
  });

  it("strips mention name and key for normal mentions", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mentions: Mentions = [{ key: "@_bot_1", name: "Bot", id: { open_id: "ou_bot" } }];
    expect(stripBotMention("@Bot hello @_bot_1", mentions)).toBe("hello");
  });

  it("treats mention.name regex metacharacters as literal text", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mentions: Mentions = [{ key: "@_bot_1", name: ".*", id: { open_id: "ou_bot" } }];
    expect(stripBotMention("@NotBot hello", mentions)).toBe("@NotBot hello");
  });

  it("treats mention.key regex metacharacters as literal text", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mentions: Mentions = [{ key: ".*", name: "Bot", id: { open_id: "ou_bot" } }];
    expect(stripBotMention("hello world", mentions)).toBe("hello world");
  });

  it("trims once after all mention replacements", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mentions: Mentions = [{ key: "@_bot_1", name: "Bot", id: { open_id: "ou_bot" } }];
    expect(stripBotMention("  @_bot_1 hello   ", mentions)).toBe("hello");
  });

  it("strips multiple mentions in one pass", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mentions: Mentions = [
      { key: "@_bot_1", name: "Bot One", id: { open_id: "ou_bot_1" } },
      { key: "@_bot_2", name: "Bot Two", id: { open_id: "ou_bot_2" } },
    ];
    expect(stripBotMention("@Bot One @_bot_1 hi @Bot Two @_bot_2", mentions)).toBe("hi");
  });
});
