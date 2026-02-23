/*
 * AUTO ANNOTATION
 * File: src/agents/tools/web-fetch.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeEach, vi } from "vitest";
import * as ssrf from "../../infra/net/ssrf.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function installWebFetchSsrfHarness() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lookupMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvePinnedHostname = ssrf.resolvePinnedHostname;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const priorFetch = global.fetch;

  beforeEach(() => {
    lookupMock.mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);
    vi.spyOn(ssrf, "resolvePinnedHostname").mockImplementation((hostname) =>
      resolvePinnedHostname(hostname, lookupMock),
    );
  });

  afterEach(() => {
    global.fetch = priorFetch;
    lookupMock.mockReset();
    vi.restoreAllMocks();
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createBaseWebFetchToolConfig(opts?: { maxResponseBytes?: number }): {
  config: {
    tools: {
      web: {
        fetch: {
          cacheTtlMinutes: number;
          firecrawl: { enabled: boolean };
          maxResponseBytes?: number;
        };
      };
    };
  };
} {
  return {
    config: {
      tools: {
        web: {
          fetch: {
            cacheTtlMinutes: 0,
            firecrawl: { enabled: false },
            ...(opts?.maxResponseBytes ? { maxResponseBytes: opts.maxResponseBytes } : {}),
          },
        },
      },
    },
  };
}
