/*
 * AUTO ANNOTATION
 * File: extensions/twitch/src/test-fixtures.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "openclaw/plugin-sdk";
import { afterEach, beforeEach, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BASE_TWITCH_TEST_ACCOUNT = {
  username: "testbot",
  clientId: "test-client-id",
  channel: "#testchannel",
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function makeTwitchTestConfig(account: Record<string, unknown>): OpenClawConfig {
  return {
    channels: {
      twitch: {
        accounts: {
          default: account,
        },
      },
    },
  } as unknown as OpenClawConfig;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function installTwitchTestHooks() {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
}
