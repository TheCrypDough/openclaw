/*
 * AUTO ANNOTATION
 * File: src/web/login.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { EventEmitter } from "node:events";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetLogger, setLoggerOverride } from "../logging.js";
import { renderQrPngBase64 } from "./qr-image.js";

vi.mock("./session.js", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ev = new EventEmitter();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sock = {
    ev,
    ws: { close: vi.fn() },
    sendPresenceUpdate: vi.fn(),
    sendMessage: vi.fn(),
  };
  return {
    createWaSocket: vi.fn().mockResolvedValue(sock),
    waitForWaConnection: vi.fn().mockResolvedValue(undefined),
  };
});

import { loginWeb } from "./login.js";
import type { waitForWaConnection } from "./session.js";

const { createWaSocket } = await import("./session.js");

describe("web login", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetLogger();
    setLoggerOverride(null);
  });

  it("loginWeb waits for connection and closes", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sock = await (
      createWaSocket as unknown as () => Promise<{ ws: { close: () => void } }>
    )();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const close = vi.spyOn(sock.ws, "close");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const waiter: typeof waitForWaConnection = vi.fn().mockResolvedValue(undefined);
    await loginWeb(false, waiter);
    expect(close).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(499);
    expect(close).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(close).toHaveBeenCalledTimes(1);
  });
});

describe("renderQrPngBase64", () => {
  it("renders a PNG data payload", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const b64 = await renderQrPngBase64("openclaw");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const buf = Buffer.from(b64, "base64");
    expect(buf.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });

  it("avoids dynamic require of qrcode-terminal vendor modules", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sourcePath = resolve(process.cwd(), "src/web/qr-image.ts");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const source = await readFile(sourcePath, "utf-8");
    expect(source).not.toContain("createRequire(");
    expect(source).not.toContain('require("qrcode-terminal/vendor/QRCode")');
    expect(source).toContain("qrcode-terminal/vendor/QRCode/index.js");
    expect(source).toContain("qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel.js");
  });
});
