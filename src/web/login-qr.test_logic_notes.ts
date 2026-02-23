/*
 * AUTO ANNOTATION
 * File: src/web/login-qr.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { startWebLoginWithQr, waitForWebLogin } from "./login-qr.js";
import { createWaSocket, logoutWeb, waitForWaConnection } from "./session.js";

vi.mock("./session.js", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const createWaSocket = vi.fn(
    async (_printQr: boolean, _verbose: boolean, opts?: { onQr?: (qr: string) => void }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const sock = { ws: { close: vi.fn() } };
      if (opts?.onQr) {
        setImmediate(() => opts.onQr?.("qr-data"));
      }
      return sock;
    },
  );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const waitForWaConnection = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const formatError = vi.fn((err: unknown) => `formatted:${String(err)}`);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const getStatusCode = vi.fn(
    (err: unknown) =>
      (err as { output?: { statusCode?: number } })?.output?.statusCode ??
      (err as { status?: number })?.status,
  );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const webAuthExists = vi.fn(async () => false);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const readWebSelfId = vi.fn(() => ({ e164: null, jid: null }));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const logoutWeb = vi.fn(async () => true);
  return {
    createWaSocket,
    waitForWaConnection,
    formatError,
    getStatusCode,
    webAuthExists,
    readWebSelfId,
    logoutWeb,
  };
});

vi.mock("./qr-image.js", () => ({
  renderQrPngBase64: vi.fn(async () => "base64"),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const createWaSocketMock = vi.mocked(createWaSocket);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const waitForWaConnectionMock = vi.mocked(waitForWaConnection);
const logoutWebMock = vi.mocked(logoutWeb);

describe("login-qr", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("restarts login once on status 515 and completes", async () => {
    waitForWaConnectionMock
      .mockRejectedValueOnce({ output: { statusCode: 515 } })
      .mockResolvedValueOnce(undefined);

    const start = await startWebLoginWithQr({ timeoutMs: 5000 });
    expect(start.qrDataUrl).toBe("data:image/png;base64,base64");

    const result = await waitForWebLogin({ timeoutMs: 5000 });

    expect(result.connected).toBe(true);
    expect(createWaSocketMock).toHaveBeenCalledTimes(2);
    expect(logoutWebMock).not.toHaveBeenCalled();
  });
});
