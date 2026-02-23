/*
 * AUTO ANNOTATION
 * File: src/cli/nodes-camera.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cameraTempPath,
  parseCameraClipPayload,
  parseCameraSnapPayload,
  writeCameraClipPayloadToFile,
  writeBase64ToFile,
  writeUrlToFile,
} from "./nodes-camera.js";
import { parseScreenRecordPayload, screenRecordTempPath } from "./nodes-screen.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function withTempDir<T>(prefix: string, run: (dir: string) => Promise<T>): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  try {
    return await run(dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function withCameraTempDir<T>(run: (dir: string) => Promise<T>): Promise<T> {
  return await withTempDir("openclaw-test-", run);
}

describe("nodes camera helpers", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function stubFetchResponse(response: Response) {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => response),
    );
  }

  it("parses camera.snap payload", () => {
    expect(
      parseCameraSnapPayload({
        format: "jpg",
        base64: "aGk=",
        width: 10,
        height: 20,
      }),
    ).toEqual({ format: "jpg", base64: "aGk=", width: 10, height: 20 });
  });

  it("rejects invalid camera.snap payload", () => {
    expect(() => parseCameraSnapPayload({ format: "jpg" })).toThrow(
      /invalid camera\.snap payload/i,
    );
  });

  it("parses camera.clip payload", () => {
    expect(
      parseCameraClipPayload({
        format: "mp4",
        base64: "AAEC",
        durationMs: 1234,
        hasAudio: true,
      }),
    ).toEqual({
      format: "mp4",
      base64: "AAEC",
      durationMs: 1234,
      hasAudio: true,
    });
  });

  it("rejects invalid camera.clip payload", () => {
    expect(() =>
      parseCameraClipPayload({ format: "mp4", base64: "AAEC", durationMs: 1234 }),
    ).toThrow(/invalid camera\.clip payload/i);
  });

  it("builds stable temp paths when id provided", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const p = cameraTempPath({
      kind: "snap",
      facing: "front",
      ext: "jpg",
      tmpDir: "/tmp",
      id: "id1",
    });
    expect(p).toBe(path.join("/tmp", "openclaw-camera-snap-front-id1.jpg"));
  });

  it("writes camera clip payload to temp path", async () => {
    await withCameraTempDir(async (dir) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const out = await writeCameraClipPayloadToFile({
        payload: {
          format: "mp4",
          base64: "aGk=",
          durationMs: 200,
          hasAudio: false,
        },
        facing: "front",
        tmpDir: dir,
        id: "clip1",
      });
      expect(out).toBe(path.join(dir, "openclaw-camera-clip-front-clip1.mp4"));
      await expect(fs.readFile(out, "utf8")).resolves.toBe("hi");
    });
  });

  it("writes camera clip payload from url", async () => {
    stubFetchResponse(new Response("url-clip", { status: 200 }));
    await withCameraTempDir(async (dir) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const out = await writeCameraClipPayloadToFile({
        payload: {
          format: "mp4",
          url: "https://example.com/clip.mp4",
          durationMs: 200,
          hasAudio: false,
        },
        facing: "back",
        tmpDir: dir,
        id: "clip2",
      });
      expect(out).toBe(path.join(dir, "openclaw-camera-clip-back-clip2.mp4"));
      await expect(fs.readFile(out, "utf8")).resolves.toBe("url-clip");
    });
  });

  it("writes base64 to file", async () => {
    await withCameraTempDir(async (dir) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const out = path.join(dir, "x.bin");
      await writeBase64ToFile(out, "aGk=");
      await expect(fs.readFile(out, "utf8")).resolves.toBe("hi");
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("writes url payload to file", async () => {
    stubFetchResponse(new Response("url-content", { status: 200 }));
    await withCameraTempDir(async (dir) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const out = path.join(dir, "x.bin");
      await writeUrlToFile(out, "https://example.com/clip.mp4");
      await expect(fs.readFile(out, "utf8")).resolves.toBe("url-content");
    });
  });

  it("rejects invalid url payload responses", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cases: Array<{
      name: string;
      url: string;
      response?: Response;
      expectedMessage: RegExp;
    }> = [
      {
        name: "non-https url",
        url: "http://example.com/x.bin",
        expectedMessage: /only https/i,
      },
      {
        name: "oversized content-length",
        url: "https://example.com/huge.bin",
        response: new Response("tiny", {
          status: 200,
          headers: { "content-length": String(999_999_999) },
        }),
        expectedMessage: /exceeds max/i,
      },
      {
        name: "non-ok status",
        url: "https://example.com/down.bin",
        response: new Response("down", { status: 503, statusText: "Service Unavailable" }),
        expectedMessage: /503/i,
      },
      {
        name: "empty response body",
        url: "https://example.com/empty.bin",
        response: new Response(null, { status: 200 }),
        expectedMessage: /empty response body/i,
      },
    ];

    for (const testCase of cases) {
      if (testCase.response) {
        stubFetchResponse(testCase.response);
      }
      await expect(writeUrlToFile("/tmp/ignored", testCase.url), testCase.name).rejects.toThrow(
        testCase.expectedMessage,
      );
    }
  });

  it("removes partially written file when url stream fails", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("partial"));
        controller.error(new Error("stream exploded"));
      },
    });
    stubFetchResponse(new Response(stream, { status: 200 }));

    await withCameraTempDir(async (dir) => {
      const out = path.join(dir, "broken.bin");
      await expect(writeUrlToFile(out, "https://example.com/broken.bin")).rejects.toThrow(
        /stream exploded/i,
      );
      await expect(fs.stat(out)).rejects.toThrow();
    });
  });
});

describe("nodes screen helpers", () => {
  it("parses screen.record payload", () => {
    const payload = parseScreenRecordPayload({
      format: "mp4",
      base64: "Zm9v",
      durationMs: 1000,
      fps: 12,
      screenIndex: 0,
      hasAudio: true,
    });
    expect(payload.format).toBe("mp4");
    expect(payload.base64).toBe("Zm9v");
    expect(payload.durationMs).toBe(1000);
    expect(payload.fps).toBe(12);
    expect(payload.screenIndex).toBe(0);
    expect(payload.hasAudio).toBe(true);
  });

  it("drops invalid optional fields instead of throwing", () => {
    const payload = parseScreenRecordPayload({
      format: "mp4",
      base64: "Zm9v",
      durationMs: "nope",
      fps: null,
      screenIndex: "0",
      hasAudio: 1,
    });
    expect(payload.durationMs).toBeUndefined();
    expect(payload.fps).toBeUndefined();
    expect(payload.screenIndex).toBeUndefined();
    expect(payload.hasAudio).toBeUndefined();
  });

  it("rejects invalid screen.record payload", () => {
    expect(() => parseScreenRecordPayload({ format: "mp4" })).toThrow(
      /invalid screen\.record payload/i,
    );
  });

  it("builds screen record temp path", () => {
    const p = screenRecordTempPath({
      ext: "mp4",
      tmpDir: "/tmp",
      id: "id1",
    });
    expect(p).toBe(path.join("/tmp", "openclaw-screen-record-id1.mp4"));
  });
});
