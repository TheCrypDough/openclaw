/*
 * AUTO ANNOTATION
 * File: src/agents/tool-images.log.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import sharp from "sharp";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { infoMock, warnMock } = vi.hoisted(() => ({
  infoMock: vi.fn(),
  warnMock: vi.fn(),
}));

vi.mock("../logging/subsystem.js", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const makeLogger = () => ({
    subsystem: "agents/tool-images",
    isEnabled: () => true,
    trace: vi.fn(),
    debug: vi.fn(),
    info: infoMock,
    warn: warnMock,
    error: vi.fn(),
    fatal: vi.fn(),
    raw: vi.fn(),
    child: () => makeLogger(),
  });
  return { createSubsystemLogger: () => makeLogger() };
});

import { sanitizeContentBlocksImages } from "./tool-images.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function createLargePng(): Promise<Buffer> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const width = 2400;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const height = 680;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = Buffer.alloc(width * height * 3, 0x7f);
  return await sharp(raw, {
    raw: { width, height, channels: 3 },
  })
    .png({ compressionLevel: 0 })
    .toBuffer();
}

describe("tool-images log context", () => {
  beforeEach(() => {
    infoMock.mockClear();
    warnMock.mockClear();
  });

  it("includes filename from MEDIA text", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const png = await createLargePng();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const blocks = [
      { type: "text" as const, text: "MEDIA:/tmp/snapshots/camera-front.png" },
      { type: "image" as const, data: png.toString("base64"), mimeType: "image/png" },
    ];
    await sanitizeContentBlocksImages(blocks, "nodes:camera_snap");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = infoMock.mock.calls[0]?.[0];
    expect(typeof message).toBe("string");
    expect(String(message)).toContain("camera-front.png");
  });

  it("includes filename from read label", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const png = await createLargePng();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const blocks = [
      { type: "image" as const, data: png.toString("base64"), mimeType: "image/png" },
    ];
    await sanitizeContentBlocksImages(blocks, "read:/tmp/images/sample-diagram.png");
    const message = infoMock.mock.calls[0]?.[0];
    expect(typeof message).toBe("string");
    expect(String(message)).toContain("sample-diagram.png");
  });
});
