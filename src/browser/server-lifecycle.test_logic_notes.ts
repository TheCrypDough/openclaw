/*
 * AUTO ANNOTATION
 * File: src/browser/server-lifecycle.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const { resolveProfileMock, ensureChromeExtensionRelayServerMock } = vi.hoisted(() => ({
  resolveProfileMock: vi.fn(),
  ensureChromeExtensionRelayServerMock: vi.fn(),
}));

const { createBrowserRouteContextMock, listKnownProfileNamesMock } = vi.hoisted(() => ({
  createBrowserRouteContextMock: vi.fn(),
  listKnownProfileNamesMock: vi.fn(),
}));

vi.mock("./config.js", () => ({
  resolveProfile: resolveProfileMock,
}));

vi.mock("./extension-relay.js", () => ({
  ensureChromeExtensionRelayServer: ensureChromeExtensionRelayServerMock,
}));

vi.mock("./server-context.js", () => ({
  createBrowserRouteContext: createBrowserRouteContextMock,
  listKnownProfileNames: listKnownProfileNamesMock,
}));

import { ensureExtensionRelayForProfiles, stopKnownBrowserProfiles } from "./server-lifecycle.js";

describe("ensureExtensionRelayForProfiles", () => {
  beforeEach(() => {
    resolveProfileMock.mockReset();
    ensureChromeExtensionRelayServerMock.mockReset();
  });

  it("starts relay only for extension profiles", async () => {
    resolveProfileMock.mockImplementation((_resolved: unknown, name: string) => {
      if (name === "chrome") {
        return { driver: "extension", cdpUrl: "http://127.0.0.1:18888" };
      }
      return { driver: "openclaw", cdpUrl: "http://127.0.0.1:18889" };
    });
    ensureChromeExtensionRelayServerMock.mockResolvedValue(undefined);

    await ensureExtensionRelayForProfiles({
      resolved: {
        profiles: {
          chrome: {},
          openclaw: {},
        },
      } as never,
      onWarn: vi.fn(),
    });

    expect(ensureChromeExtensionRelayServerMock).toHaveBeenCalledTimes(1);
    expect(ensureChromeExtensionRelayServerMock).toHaveBeenCalledWith({
      cdpUrl: "http://127.0.0.1:18888",
    });
  });

  it("reports relay startup errors", async () => {
    resolveProfileMock.mockReturnValue({ driver: "extension", cdpUrl: "http://127.0.0.1:18888" });
    ensureChromeExtensionRelayServerMock.mockRejectedValue(new Error("boom"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onWarn = vi.fn();

    await ensureExtensionRelayForProfiles({
      resolved: { profiles: { chrome: {} } } as never,
      onWarn,
    });

    expect(onWarn).toHaveBeenCalledWith(
      'Chrome extension relay init failed for profile "chrome": Error: boom',
    );
  });
});

describe("stopKnownBrowserProfiles", () => {
  beforeEach(() => {
    createBrowserRouteContextMock.mockReset();
    listKnownProfileNamesMock.mockReset();
  });

  it("stops all known profiles and ignores per-profile failures", async () => {
    listKnownProfileNamesMock.mockReturnValue(["openclaw", "chrome"]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stopMap: Record<string, ReturnType<typeof vi.fn>> = {
      openclaw: vi.fn(async () => {}),
      chrome: vi.fn(async () => {
        throw new Error("profile stop failed");
      }),
    };
    createBrowserRouteContextMock.mockReturnValue({
      forProfile: (name: string) => ({
        stopRunningBrowser: stopMap[name],
      }),
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onWarn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const state = { resolved: { profiles: {} }, profiles: new Map() };

    await stopKnownBrowserProfiles({
      getState: () => state as never,
      onWarn,
    });

    expect(stopMap.openclaw).toHaveBeenCalledTimes(1);
    expect(stopMap.chrome).toHaveBeenCalledTimes(1);
    expect(onWarn).not.toHaveBeenCalled();
  });

  it("warns when profile enumeration fails", async () => {
    listKnownProfileNamesMock.mockImplementation(() => {
      throw new Error("oops");
    });
    createBrowserRouteContextMock.mockReturnValue({
      forProfile: vi.fn(),
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onWarn = vi.fn();

    await stopKnownBrowserProfiles({
      getState: () => ({ resolved: { profiles: {} }, profiles: new Map() }) as never,
      onWarn,
    });

    expect(onWarn).toHaveBeenCalledWith("openclaw browser stop failed: Error: oops");
  });
});
