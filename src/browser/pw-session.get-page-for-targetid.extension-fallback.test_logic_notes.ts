/*
 * AUTO ANNOTATION
 * File: src/browser/pw-session.get-page-for-targetid.extension-fallback.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { closePlaywrightBrowserConnection, getPageForTargetId } from "./pw-session.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const connectOverCdpMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const getChromeWebSocketUrlMock = vi.fn();

vi.mock("playwright-core", () => ({
  chromium: {
    connectOverCDP: (...args: unknown[]) => connectOverCdpMock(...args),
  },
}));

vi.mock("./chrome.js", () => ({
  getChromeWebSocketUrl: (...args: unknown[]) => getChromeWebSocketUrlMock(...args),
}));

describe("pw-session getPageForTargetId", () => {
  it("falls back to the only page when CDP session attachment is blocked (extension relays)", async () => {
    connectOverCdpMock.mockReset();
    getChromeWebSocketUrlMock.mockReset();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pageOn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const contextOn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const browserOn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const browserClose = vi.fn(async () => {});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const context = {
      pages: () => [],
      on: contextOn,
      newCDPSession: vi.fn(async () => {
        throw new Error("Not allowed");
      }),
    } as unknown as import("playwright-core").BrowserContext;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const page = {
      on: pageOn,
      context: () => context,
    } as unknown as import("playwright-core").Page;

    // Fill pages() after page exists.
    (context as unknown as { pages: () => unknown[] }).pages = () => [page];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const browser = {
      contexts: () => [context],
      on: browserOn,
      close: browserClose,
    } as unknown as import("playwright-core").Browser;

    connectOverCdpMock.mockResolvedValue(browser);
    getChromeWebSocketUrlMock.mockResolvedValue(null);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = await getPageForTargetId({
      cdpUrl: "http://127.0.0.1:18792",
      targetId: "NOT_A_TAB",
    });
    expect(resolved).toBe(page);

    await closePlaywrightBrowserConnection();
    expect(browserClose).toHaveBeenCalled();
  });
});
