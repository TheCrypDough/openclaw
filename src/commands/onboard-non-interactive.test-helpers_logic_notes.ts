/*
 * AUTO ANNOTATION
 * File: src/commands/onboard-non-interactive.test-helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import type { RuntimeEnv } from "../runtime.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type RuntimeLike = Pick<RuntimeEnv, "log" | "error" | "exit">;

export type NonInteractiveRuntime = {
  log: RuntimeLike["log"];
  error: RuntimeLike["error"];
  exit: RuntimeLike["exit"];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const NON_INTERACTIVE_DEFAULT_OPTIONS = {
  nonInteractive: true,
  skipHealth: true,
  skipChannels: true,
  json: true,
} as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createThrowingRuntime(): NonInteractiveRuntime {
  return {
    log: () => {},
    error: (...args: unknown[]) => {
      throw new Error(args.map(String).join(" "));
    },
    exit: (code: number) => {
      throw new Error(`exit:${code}`);
    },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runNonInteractiveOnboarding(
  options: Record<string, unknown>,
  runtime: NonInteractiveRuntime,
): Promise<void> {
  const { runNonInteractiveOnboarding: run } = await import("./onboard-non-interactive.js");
  await run(options, runtime);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runNonInteractiveOnboardingWithDefaults(
  runtime: NonInteractiveRuntime,
  options: Record<string, unknown>,
): Promise<void> {
  await runNonInteractiveOnboarding(
    {
      ...NON_INTERACTIVE_DEFAULT_OPTIONS,
      ...options,
    },
    runtime,
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
}
