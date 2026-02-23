/*
 * AUTO ANNOTATION
 * File: src/web/login.coverage.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { DisconnectReason } from "@whiskeysockets/baileys";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loginWeb } from "./login.js";
import { createWaSocket, formatError, waitForWaConnection } from "./session.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const rmMock = vi.spyOn(fs, "rm");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveTestAuthDir() {
  return path.join(os.tmpdir(), "wa-creds");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const authDir = resolveTestAuthDir();

vi.mock("../config/config.js", () => ({
  loadConfig: () =>
    ({
      channels: {
        whatsapp: {
          accounts: {
            default: { enabled: true, authDir: resolveTestAuthDir() },
          },
        },
      },
    }) as never,
}));

vi.mock("./session.js", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const authDir = resolveTestAuthDir();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sockA = { ws: { close: vi.fn() } };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sockB = { ws: { close: vi.fn() } };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let call = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const createWaSocket = vi.fn(async () => (call++ === 0 ? sockA : sockB));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const waitForWaConnection = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const formatError = vi.fn((err: unknown) => `formatted:${String(err)}`);
  return {
    createWaSocket,
    waitForWaConnection,
    formatError,
    WA_WEB_AUTH_DIR: authDir,
    logoutWeb: vi.fn(async (params: { authDir?: string }) => {
      await fs.rm(params.authDir ?? authDir, {
        recursive: true,
        force: true,
      });
      return true;
    }),
  };
});

const createWaSocketMock = vi.mocked(createWaSocket);
const waitForWaConnectionMock = vi.mocked(waitForWaConnection);
const formatErrorMock = vi.mocked(formatError);

describe("loginWeb coverage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    rmMock.mockClear();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("restarts once when WhatsApp requests code 515", async () => {
    waitForWaConnectionMock
      .mockRejectedValueOnce({ output: { statusCode: 515 } })
      .mockResolvedValueOnce(undefined);

    const runtime = { log: vi.fn(), error: vi.fn() } as never;
    await loginWeb(false, waitForWaConnectionMock as never, runtime);

    expect(createWaSocketMock).toHaveBeenCalledTimes(2);
    const firstSock = await createWaSocketMock.mock.results[0]?.value;
    expect(firstSock.ws.close).toHaveBeenCalled();
    vi.runAllTimers();
    const secondSock = await createWaSocketMock.mock.results[1]?.value;
    expect(secondSock.ws.close).toHaveBeenCalled();
  });

  it("clears creds and throws when logged out", async () => {
    waitForWaConnectionMock.mockRejectedValueOnce({
      output: { statusCode: DisconnectReason.loggedOut },
    });

    await expect(loginWeb(false, waitForWaConnectionMock as never)).rejects.toThrow(
      /cache cleared/i,
    );
    expect(rmMock).toHaveBeenCalledWith(authDir, {
      recursive: true,
      force: true,
    });
  });

  it("formats and rethrows generic errors", async () => {
    waitForWaConnectionMock.mockRejectedValueOnce(new Error("boom"));
    await expect(loginWeb(false, waitForWaConnectionMock as never)).rejects.toThrow(
      "formatted:Error: boom",
    );
    expect(formatErrorMock).toHaveBeenCalled();
  });
});
