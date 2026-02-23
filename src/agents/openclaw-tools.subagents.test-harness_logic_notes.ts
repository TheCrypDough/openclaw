/*
 * AUTO ANNOTATION
 * File: src/agents/openclaw-tools.subagents.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";
import type { MockFn } from "../test-utils/vitest-mock-fn.js";

export type LoadedConfig = ReturnType<(typeof import("../config/config.js"))["loadConfig"]>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const callGatewayMock: MockFn = vi.fn();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const defaultConfig: LoadedConfig = {
  session: {
    mainKey: "main",
    scope: "per-sender",
  },
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let configOverride: LoadedConfig = defaultConfig;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setSubagentsConfigOverride(next: LoadedConfig) {
  configOverride = next;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resetSubagentsConfigOverride() {
  configOverride = defaultConfig;
}

vi.mock("../gateway/call.js", () => ({
  callGateway: (opts: unknown) => callGatewayMock(opts),
}));

vi.mock("../config/config.js", async (importOriginal) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await importOriginal<typeof import("../config/config.js")>();
  return {
    ...actual,
    loadConfig: () => configOverride,
    resolveGatewayPort: () => 18789,
  };
});
