/*
 * AUTO ANNOTATION
 * File: src/channels/telegram/allow-from.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { isNumericTelegramUserId, normalizeTelegramAllowFromEntry } from "./allow-from.js";

describe("telegram allow-from helpers", () => {
  it("normalizes tg/telegram prefixes", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cases = [
      { value: " TG:123 ", expected: "123" },
      { value: "telegram:@someone", expected: "@someone" },
    ] as const;
    for (const testCase of cases) {
      expect(normalizeTelegramAllowFromEntry(testCase.value)).toBe(testCase.expected);
    }
  });

  it("accepts signed numeric IDs", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cases = [
      { value: "123456789", expected: true },
      { value: "-1001234567890", expected: true },
      { value: "@someone", expected: false },
      { value: "12 34", expected: false },
    ] as const;
    for (const testCase of cases) {
      expect(isNumericTelegramUserId(testCase.value)).toBe(testCase.expected);
    }
  });
});
