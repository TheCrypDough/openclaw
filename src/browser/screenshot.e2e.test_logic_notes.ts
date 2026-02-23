/*
 * AUTO ANNOTATION
 * File: src/browser/screenshot.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { normalizeBrowserScreenshot } from "./screenshot.js";

describe("browser screenshot normalization", () => {
  it("shrinks oversized images to <=2000x2000 and <=5MB", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const bigPng = await sharp({
      create: {
        width: 2100,
        height: 2100,
        channels: 3,
        background: { r: 12, g: 34, b: 56 },
      },
    })
      .png({ compressionLevel: 0 })
      .toBuffer();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = await normalizeBrowserScreenshot(bigPng, {
      maxSide: 2000,
      maxBytes: 5 * 1024 * 1024,
    });

    expect(normalized.buffer.byteLength).toBeLessThanOrEqual(5 * 1024 * 1024);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const meta = await sharp(normalized.buffer).metadata();
    expect(Number(meta.width)).toBeLessThanOrEqual(2000);
    expect(Number(meta.height)).toBeLessThanOrEqual(2000);
    expect(normalized.buffer[0]).toBe(0xff);
    expect(normalized.buffer[1]).toBe(0xd8);
  }, 120_000);

  it("keeps already-small screenshots unchanged", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const jpeg = await sharp({
      create: {
        width: 800,
        height: 600,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .jpeg({ quality: 80 })
      .toBuffer();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = await normalizeBrowserScreenshot(jpeg, {
      maxSide: 2000,
      maxBytes: 5 * 1024 * 1024,
    });

    expect(normalized.buffer.equals(jpeg)).toBe(true);
  });
});
