# AUTOPLACEHOLDER_ANNOTATION: src/commands/test-runtime-config-helpers.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { vi } from "vitest";
import type { RuntimeEnv } from "../runtime.js";
import type { MockFn } from "../test-utils/vitest-mock-fn.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const baseConfigSnapshot = {
  path: "/tmp/openclaw.json",
  exists: true,
  raw: "{}",
  parsed: {},
  valid: true,
  config: {},
  issues: [],
  legacyIssues: [],
};

export type TestRuntime = {
  log: MockFn<RuntimeEnv["log"]>;
  error: MockFn<RuntimeEnv["error"]>;
  exit: MockFn<RuntimeEnv["exit"]>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createTestRuntime(): TestRuntime {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const log = vi.fn() as MockFn<RuntimeEnv["log"]>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const error = vi.fn() as MockFn<RuntimeEnv["error"]>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const exit = vi.fn((_: number) => undefined) as MockFn<RuntimeEnv["exit"]>;
  return {
    log,
    error,
    exit,
  };
}
