/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/monitor/media.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { PluginRuntime } from "openclaw/plugin-sdk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setMatrixRuntime } from "../../runtime.js";
import { downloadMatrixMedia } from "./media.js";

describe("downloadMatrixMedia", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const saveMediaBuffer = vi.fn().mockResolvedValue({
    path: "/tmp/media",
    contentType: "image/png",
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runtimeStub = {
    channel: {
      media: {
        saveMediaBuffer: (...args: unknown[]) => saveMediaBuffer(...args),
      },
    },
  } as unknown as PluginRuntime;

  beforeEach(() => {
    vi.clearAllMocks();
    setMatrixRuntime(runtimeStub);
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function makeEncryptedMediaFixture() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const decryptMedia = vi.fn().mockResolvedValue(Buffer.from("decrypted"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = {
      crypto: { decryptMedia },
      mxcToHttp: vi.fn().mockReturnValue("https://example/mxc"),
    } as unknown as import("@vector-im/matrix-bot-sdk").MatrixClient;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const file = {
      url: "mxc://example/file",
      key: {
        kty: "oct",
        key_ops: ["encrypt", "decrypt"],
        alg: "A256CTR",
        k: "secret",
        ext: true,
      },
      iv: "iv",
      hashes: { sha256: "hash" },
      v: "v2",
    };
    return { decryptMedia, client, file };
  }

  it("decrypts encrypted media when file payloads are present", async () => {
    const { decryptMedia, client, file } = makeEncryptedMediaFixture();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await downloadMatrixMedia({
      client,
      mxcUrl: "mxc://example/file",
      contentType: "image/png",
      maxBytes: 1024,
      file,
    });

    // decryptMedia should be called with just the file object (it handles download internally)
    expect(decryptMedia).toHaveBeenCalledWith(file);
    expect(saveMediaBuffer).toHaveBeenCalledWith(
      Buffer.from("decrypted"),
      "image/png",
      "inbound",
      1024,
    );
    expect(result?.path).toBe("/tmp/media");
  });

  it("rejects encrypted media that exceeds maxBytes before decrypting", async () => {
    const { decryptMedia, client, file } = makeEncryptedMediaFixture();

    await expect(
      downloadMatrixMedia({
        client,
        mxcUrl: "mxc://example/file",
        contentType: "image/png",
        sizeBytes: 2048,
        maxBytes: 1024,
        file,
      }),
    ).rejects.toThrow("Matrix media exceeds configured size limit");

    expect(decryptMedia).not.toHaveBeenCalled();
    expect(saveMediaBuffer).not.toHaveBeenCalled();
  });
});
