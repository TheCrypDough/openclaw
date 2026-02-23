/*
 * AUTO ANNOTATION
 * File: src/browser/pw-session.create-page.navigation-guard.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { InvalidBrowserNavigationUrlError } from "./navigation-guard.js";
import { closePlaywrightBrowserConnection, createPageViaPlaywright } from "./pw-session.js";

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

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function installBrowserMocks() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pageOn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pageGoto = vi.fn(async () => {});
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pageTitle = vi.fn(async () => "");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pageUrl = vi.fn(() => "about:blank");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const contextOn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const browserOn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const browserClose = vi.fn(async () => {});
  const sessionSend = vi.fn(async (method: string) => {
    if (method === "Target.getTargetInfo") {
      return { targetInfo: { targetId: "TARGET_1" } };
    }
    return {};
  });
  const sessionDetach = vi.fn(async () => {});

  const context = {
    pages: () => [],
    on: contextOn,
    newPage: vi.fn(async () => page),
    newCDPSession: vi.fn(async () => ({
      send: sessionSend,
      detach: sessionDetach,
    })),
  } as unknown as import("playwright-core").BrowserContext;

  const page = {
    on: pageOn,
    context: () => context,
    goto: pageGoto,
    title: pageTitle,
    url: pageUrl,
  } as unknown as import("playwright-core").Page;

  const browser = {
    contexts: () => [context],
    on: browserOn,
    close: browserClose,
  } as unknown as import("playwright-core").Browser;

  connectOverCdpMock.mockResolvedValue(browser);
  getChromeWebSocketUrlMock.mockResolvedValue(null);

  return { pageGoto, browserClose };
}

afterEach(async () => {
  connectOverCdpMock.mockReset();
  getChromeWebSocketUrlMock.mockReset();
  await closePlaywrightBrowserConnection().catch(() => {});
});

describe("pw-session createPageViaPlaywright navigation guard", () => {
  it("blocks unsupported non-network URLs", async () => {
    const { pageGoto } = installBrowserMocks();

    await expect(
      createPageViaPlaywright({
        cdpUrl: "http://127.0.0.1:18792",
        url: "file:///etc/passwd",
      }),
    ).rejects.toBeInstanceOf(InvalidBrowserNavigationUrlError);

    expect(pageGoto).not.toHaveBeenCalled();
  });

  it("allows about:blank without network navigation", async () => {
    const { pageGoto } = installBrowserMocks();

    const created = await createPageViaPlaywright({
      cdpUrl: "http://127.0.0.1:18792",
      url: "about:blank",
    });

    expect(created.targetId).toBe("TARGET_1");
    expect(pageGoto).not.toHaveBeenCalled();
  });
});
