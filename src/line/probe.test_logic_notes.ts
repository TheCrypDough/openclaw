/*
 * AUTO ANNOTATION
 * File: src/line/probe.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
const { getBotInfoMock, MessagingApiClientMock } = vi.hoisted(() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const getBotInfoMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const MessagingApiClientMock = vi.fn(function () {
    return { getBotInfo: getBotInfoMock };
  });
  return { getBotInfoMock, MessagingApiClientMock };
});

vi.mock("@line/bot-sdk", () => ({
  messagingApi: { MessagingApiClient: MessagingApiClientMock },
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let probeLineBot: typeof import("./probe.js").probeLineBot;

afterEach(() => {
  vi.useRealTimers();
  getBotInfoMock.mockReset();
});

describe("probeLineBot", () => {
  beforeAll(async () => {
    ({ probeLineBot } = await import("./probe.js"));
  });

  it("returns timeout when bot info stalls", async () => {
    vi.useFakeTimers();
    getBotInfoMock.mockImplementation(() => new Promise(() => {}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const probePromise = probeLineBot("token", 10);
    await vi.advanceTimersByTimeAsync(20);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await probePromise;

    expect(result.ok).toBe(false);
    expect(result.error).toBe("timeout");
  });

  it("returns bot info when available", async () => {
    getBotInfoMock.mockResolvedValue({
      displayName: "OpenClaw",
      userId: "U123",
      basicId: "@openclaw",
      pictureUrl: "https://example.com/bot.png",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await probeLineBot("token", 50);

    expect(result.ok).toBe(true);
    expect(result.bot?.userId).toBe("U123");
  });
});
