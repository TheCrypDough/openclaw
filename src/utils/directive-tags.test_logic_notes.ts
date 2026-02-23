/*
 * AUTO ANNOTATION
 * File: src/utils/directive-tags.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, test } from "vitest";
import { stripInlineDirectiveTagsForDisplay } from "./directive-tags.js";

describe("stripInlineDirectiveTagsForDisplay", () => {
  test("removes reply and audio directives", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const input = "hello [[reply_to_current]] world [[reply_to:abc-123]] [[audio_as_voice]]";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = stripInlineDirectiveTagsForDisplay(input);
    expect(result.changed).toBe(true);
    expect(result.text).toBe("hello  world  ");
  });

  test("supports whitespace variants", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const input = "[[ reply_to : 123 ]]ok[[ audio_as_voice ]]";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = stripInlineDirectiveTagsForDisplay(input);
    expect(result.changed).toBe(true);
    expect(result.text).toBe("ok");
  });

  test("does not mutate plain text", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const input = "  keep leading and trailing whitespace  ";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = stripInlineDirectiveTagsForDisplay(input);
    expect(result.changed).toBe(false);
    expect(result.text).toBe(input);
  });
});
