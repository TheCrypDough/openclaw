/*
 * AUTO ANNOTATION
 * File: src/media-understanding/providers/audio.test-helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MockInstance } from "vitest";
import { afterEach, beforeEach, vi } from "vitest";
import * as ssrf from "../../infra/net/ssrf.js";
import { withFetchPreconnect } from "../../test-utils/fetch-mock.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveRequestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") {
    return input;
  }
  if (input instanceof URL) {
    return input.toString();
  }
  return input.url;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function installPinnedHostnameTestHooks(): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvePinnedHostname = ssrf.resolvePinnedHostname;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvePinnedHostnameWithPolicy = ssrf.resolvePinnedHostnameWithPolicy;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lookupMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let resolvePinnedHostnameSpy: MockInstance | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let resolvePinnedHostnameWithPolicySpy: MockInstance | null = null;

  beforeEach(() => {
    lookupMock.mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);
    resolvePinnedHostnameSpy = vi
      .spyOn(ssrf, "resolvePinnedHostname")
      .mockImplementation((hostname) => resolvePinnedHostname(hostname, lookupMock));
    resolvePinnedHostnameWithPolicySpy = vi
      .spyOn(ssrf, "resolvePinnedHostnameWithPolicy")
      .mockImplementation((hostname, params) =>
        resolvePinnedHostnameWithPolicy(hostname, { ...params, lookupFn: lookupMock }),
      );
  });

  afterEach(() => {
    lookupMock.mockReset();
    resolvePinnedHostnameSpy?.mockRestore();
    resolvePinnedHostnameWithPolicySpy?.mockRestore();
    resolvePinnedHostnameSpy = null;
    resolvePinnedHostnameWithPolicySpy = null;
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createAuthCaptureJsonFetch(responseBody: unknown) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let seenAuth: string | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fetchFn = withFetchPreconnect(async (_input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    seenAuth = headers.get("authorization");
    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  });
  return {
    fetchFn,
    getAuthHeader: () => seenAuth,
  };
}

export function createRequestCaptureJsonFetch(responseBody: unknown) {
  let seenUrl: string | null = null;
  let seenInit: RequestInit | undefined;
  const fetchFn = withFetchPreconnect(async (input: RequestInfo | URL, init?: RequestInit) => {
    seenUrl = resolveRequestUrl(input);
    seenInit = init;
    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  });
  return {
    fetchFn,
    getRequest: () => ({ url: seenUrl, init: seenInit }),
  };
}
