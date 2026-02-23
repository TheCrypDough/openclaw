/*
 * AUTO ANNOTATION
 * File: src/telegram/voice.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { resolveTelegramVoiceSend } from "./voice.js";

describe("resolveTelegramVoiceSend", () => {
  it("skips voice when wantsVoice is false", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const logFallback = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveTelegramVoiceSend({
      wantsVoice: false,
      contentType: "audio/ogg",
      fileName: "voice.ogg",
      logFallback,
    });
    expect(result.useVoice).toBe(false);
    expect(logFallback).not.toHaveBeenCalled();
  });

  it("logs fallback for incompatible media", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const logFallback = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveTelegramVoiceSend({
      wantsVoice: true,
      contentType: "audio/wav",
      fileName: "track.wav",
      logFallback,
    });
    expect(result.useVoice).toBe(false);
    expect(logFallback).toHaveBeenCalledWith(
      "Telegram voice requested but media is audio/wav (track.wav); sending as audio file instead.",
    );
  });

  it("keeps voice when compatible", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const logFallback = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveTelegramVoiceSend({
      wantsVoice: true,
      contentType: "audio/ogg",
      fileName: "voice.ogg",
      logFallback,
    });
    expect(result.useVoice).toBe(true);
    expect(logFallback).not.toHaveBeenCalled();
  });

  it.each([
    { contentType: "audio/mpeg", fileName: "track.mp3" },
    { contentType: "audio/mp4", fileName: "track.m4a" },
  ])("keeps voice for compatible MIME $contentType", ({ contentType, fileName }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const logFallback = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = resolveTelegramVoiceSend({
      wantsVoice: true,
      contentType,
      fileName,
      logFallback,
    });
    expect(result.useVoice).toBe(true);
    expect(logFallback).not.toHaveBeenCalled();
  });
});
