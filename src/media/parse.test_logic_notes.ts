/*
 * AUTO ANNOTATION
 * File: src/media/parse.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { splitMediaFromOutput } from "./parse.js";

describe("splitMediaFromOutput", () => {
  it("detects audio_as_voice tag and strips it", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = splitMediaFromOutput("Hello [[audio_as_voice]] world");
    expect(result.audioAsVoice).toBe(true);
    expect(result.text).toBe("Hello world");
  });

  it("accepts supported media path variants", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pathCases = [
      ["/Users/pete/My File.png", "MEDIA:/Users/pete/My File.png"],
      ["/Users/pete/My File.png", 'MEDIA:"/Users/pete/My File.png"'],
      ["~/Pictures/My File.png", "MEDIA:~/Pictures/My File.png"],
      ["../../etc/passwd", "MEDIA:../../etc/passwd"],
      ["./screenshots/image.png", "MEDIA:./screenshots/image.png"],
      ["media/inbound/image.png", "MEDIA:media/inbound/image.png"],
      ["./screenshot.png", "  MEDIA:./screenshot.png"],
      ["C:\\Users\\pete\\Pictures\\snap.png", "MEDIA:C:\\Users\\pete\\Pictures\\snap.png"],
      [
        "/tmp/tts-fAJy8C/voice-1770246885083.opus",
        "MEDIA:/tmp/tts-fAJy8C/voice-1770246885083.opus",
      ],
      ["image.png", "MEDIA:image.png"],
    ] as const;
    for (const [expectedPath, input] of pathCases) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = splitMediaFromOutput(input);
      expect(result.mediaUrls).toEqual([expectedPath]);
      expect(result.text).toBe("");
    }
  });

  it("keeps audio_as_voice detection stable across calls", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const input = "Hello [[audio_as_voice]]";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const first = splitMediaFromOutput(input);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const second = splitMediaFromOutput(input);
    expect(first.audioAsVoice).toBe(true);
    expect(second.audioAsVoice).toBe(true);
  });

  it("keeps MEDIA mentions in prose", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const input = "The MEDIA: tag fails to deliver";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = splitMediaFromOutput(input);
    expect(result.mediaUrls).toBeUndefined();
    expect(result.text).toBe(input);
  });

  it("rejects bare words without file extensions", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = splitMediaFromOutput("MEDIA:screenshot");
    expect(result.mediaUrls).toBeUndefined();
  });
});
