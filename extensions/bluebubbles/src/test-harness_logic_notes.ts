/*
 * AUTO ANNOTATION
 * File: extensions/bluebubbles/src/test-harness.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Mock } from "vitest";
import { afterEach, beforeEach, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveBlueBubblesAccountFromConfig(params: {
  cfg?: { channels?: { bluebubbles?: Record<string, unknown> } };
  accountId?: string;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const config = params.cfg?.channels?.bluebubbles ?? {};
  return {
    accountId: params.accountId ?? "default",
    enabled: config.enabled !== false,
    configured: Boolean(config.serverUrl && config.password),
    config,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createBlueBubblesAccountsMockModule() {
  return {
    resolveBlueBubblesAccount: vi.fn(resolveBlueBubblesAccountFromConfig),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type BlueBubblesProbeMockModule = {
  getCachedBlueBubblesPrivateApiStatus: Mock<() => boolean | null>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createBlueBubblesProbeMockModule(): BlueBubblesProbeMockModule {
  return {
    getCachedBlueBubblesPrivateApiStatus: vi.fn().mockReturnValue(null),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function installBlueBubblesFetchTestHooks(params: {
  mockFetch: ReturnType<typeof vi.fn>;
  privateApiStatusMock: {
    mockReset: () => unknown;
    mockReturnValue: (value: boolean | null) => unknown;
  };
}) {
  beforeEach(() => {
    vi.stubGlobal("fetch", params.mockFetch);
    params.mockFetch.mockReset();
    params.privateApiStatusMock.mockReset();
    params.privateApiStatusMock.mockReturnValue(null);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
}
