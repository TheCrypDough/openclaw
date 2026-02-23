/*
 * AUTO ANNOTATION
 * File: src/media/store.redirect.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PassThrough } from "node:stream";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createPinnedLookup } from "../infra/net/ssrf.js";
import { captureEnv } from "../test-utils/env.js";
import { saveMediaSource, setMediaStoreNetworkDepsForTest } from "./store.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const HOME = path.join(os.tmpdir(), "openclaw-home-redirect");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const mockRequest = vi.fn();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createMockHttpExchange() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = Object.assign(new PassThrough(), {
    statusCode: 0,
    headers: {} as Record<string, string>,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const req = {
    on: (event: string, handler: (...args: unknown[]) => void) => {
      if (event === "error") {
        res.on("error", handler);
      }
      return req;
    },
    end: () => undefined,
    destroy: () => res.destroy(),
  } as const;
  return { req, res };
}

describe("media store redirects", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let envSnapshot: ReturnType<typeof captureEnv>;

  beforeAll(async () => {
    envSnapshot = captureEnv(["OPENCLAW_STATE_DIR"]);
    await fs.rm(HOME, { recursive: true, force: true });
    process.env.OPENCLAW_STATE_DIR = HOME;
  });

  beforeEach(() => {
    mockRequest.mockReset();
    setMediaStoreNetworkDepsForTest({
      httpRequest: (...args) => mockRequest(...args),
      httpsRequest: (...args) => mockRequest(...args),
      resolvePinnedHostname: async (hostname) => ({
        hostname,
        addresses: ["93.184.216.34"],
        lookup: createPinnedLookup({ hostname, addresses: ["93.184.216.34"] }),
      }),
    });
  });

  afterAll(async () => {
    await fs.rm(HOME, { recursive: true, force: true });
    envSnapshot.restore();
    setMediaStoreNetworkDepsForTest();
    vi.clearAllMocks();
  });

  it("follows redirects and keeps detected mime/extension", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let call = 0;
    mockRequest.mockImplementation((_url, _opts, cb) => {
      call += 1;
      const { req, res } = createMockHttpExchange();

      if (call === 1) {
        res.statusCode = 302;
        res.headers = { location: "https://example.com/final" };
        setImmediate(() => {
          cb(res as unknown);
          res.end();
        });
      } else {
        res.statusCode = 200;
        res.headers = { "content-type": "text/plain" };
        setImmediate(() => {
          cb(res as unknown);
          res.write("redirected");
          res.end();
        });
      }

      return req;
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const saved = await saveMediaSource("https://example.com/start");

    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(saved.contentType).toBe("text/plain");
    expect(path.extname(saved.path)).toBe(".txt");
    expect(await fs.readFile(saved.path, "utf8")).toBe("redirected");
  });

  it("fails when redirect response omits location header", async () => {
    mockRequest.mockImplementationOnce((_url, _opts, cb) => {
      const { req, res } = createMockHttpExchange();
      res.statusCode = 302;
      res.headers = {};
      setImmediate(() => {
        cb(res as unknown);
        res.end();
      });
      return req;
    });

    await expect(saveMediaSource("https://example.com/start")).rejects.toThrow(
      "Redirect loop or missing Location header",
    );
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });
});
