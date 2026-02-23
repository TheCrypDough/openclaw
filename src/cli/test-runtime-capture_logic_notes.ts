/*
 * AUTO ANNOTATION
 * File: src/cli/test-runtime-capture.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { RuntimeEnv } from "../runtime.js";

export type CliRuntimeCapture = {
  runtimeLogs: string[];
  runtimeErrors: string[];
  defaultRuntime: Pick<RuntimeEnv, "log" | "error" | "exit">;
  resetRuntimeCapture: () => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createCliRuntimeCapture(): CliRuntimeCapture {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runtimeLogs: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runtimeErrors: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stringifyArgs = (args: unknown[]) => args.map((value) => String(value)).join(" ");
  return {
    runtimeLogs,
    runtimeErrors,
    defaultRuntime: {
      log: (...args: unknown[]) => {
        runtimeLogs.push(stringifyArgs(args));
      },
      error: (...args: unknown[]) => {
        runtimeErrors.push(stringifyArgs(args));
      },
      exit: (code: number) => {
        throw new Error(`__exit__:${code}`);
      },
    },
    resetRuntimeCapture: () => {
      runtimeLogs.length = 0;
      runtimeErrors.length = 0;
    },
  };
}
