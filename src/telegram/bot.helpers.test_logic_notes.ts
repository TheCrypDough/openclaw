/*
 * AUTO ANNOTATION
 * File: src/telegram/bot.helpers.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { resolveTelegramStreamMode } from "./bot/helpers.js";

describe("resolveTelegramStreamMode", () => {
  it("defaults to off when telegram streaming is unset", () => {
    expect(resolveTelegramStreamMode(undefined)).toBe("off");
    expect(resolveTelegramStreamMode({})).toBe("off");
  });

  it("prefers explicit streaming boolean", () => {
    expect(resolveTelegramStreamMode({ streaming: true })).toBe("partial");
    expect(resolveTelegramStreamMode({ streaming: false })).toBe("off");
  });

  it("maps legacy streamMode values", () => {
    expect(resolveTelegramStreamMode({ streamMode: "off" })).toBe("off");
    expect(resolveTelegramStreamMode({ streamMode: "partial" })).toBe("partial");
    expect(resolveTelegramStreamMode({ streamMode: "block" })).toBe("block");
  });

  it("maps unified progress mode to partial on Telegram", () => {
    expect(resolveTelegramStreamMode({ streaming: "progress" })).toBe("partial");
  });
});
