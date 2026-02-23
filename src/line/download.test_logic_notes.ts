/*
 * AUTO ANNOTATION
 * File: src/line/download.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const getMessageContentMock = vi.hoisted(() => vi.fn());

vi.mock("@line/bot-sdk", () => ({
  messagingApi: {
    MessagingApiBlobClient: class {
      getMessageContent(messageId: string) {
        return getMessageContentMock(messageId);
      }
    },
  },
}));

vi.mock("../globals.js", () => ({
  logVerbose: () => {},
}));

import { downloadLineMedia } from "./download.js";

async function* chunks(parts: Buffer[]): AsyncGenerator<Buffer> {
  for (const part of parts) {
    yield part;
  }
}

describe("downloadLineMedia", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not derive temp file path from external messageId", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const messageId = "a/../../../../etc/passwd";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0x00]);
    getMessageContentMock.mockResolvedValueOnce(chunks([jpeg]));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const writeSpy = vi.spyOn(fs.promises, "writeFile").mockResolvedValueOnce(undefined);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await downloadLineMedia(messageId, "token");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const writtenPath = writeSpy.mock.calls[0]?.[0];

    expect(result.size).toBe(jpeg.length);
    expect(result.contentType).toBe("image/jpeg");
    expect(typeof writtenPath).toBe("string");
    if (typeof writtenPath !== "string") {
      throw new Error("expected string temp file path");
    }
    expect(result.path).toBe(writtenPath);
    expect(writtenPath).toContain("line-media-");
    expect(writtenPath).toMatch(/\.jpg$/);
    expect(writtenPath).not.toContain(messageId);
    expect(writtenPath).not.toContain("..");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tmpRoot = path.resolve(os.tmpdir());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rel = path.relative(tmpRoot, path.resolve(writtenPath));
    expect(rel === ".." || rel.startsWith(`..${path.sep}`)).toBe(false);
  });

  it("rejects oversized media before writing to disk", async () => {
    getMessageContentMock.mockResolvedValueOnce(chunks([Buffer.alloc(4), Buffer.alloc(4)]));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const writeSpy = vi.spyOn(fs.promises, "writeFile").mockResolvedValue(undefined);

    await expect(downloadLineMedia("mid", "token", 7)).rejects.toThrow(/Media exceeds/i);
    expect(writeSpy).not.toHaveBeenCalled();
  });
});
