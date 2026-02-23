/*
 * AUTO ANNOTATION
 * File: src/cli/cli-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import { formatErrorMessage } from "../infra/errors.js";

export { formatErrorMessage };

export type ManagerLookupResult<T> = {
  manager: T | null;
  error?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withManager<T>(params: {
  getManager: () => Promise<ManagerLookupResult<T>>;
  onMissing: (error?: string) => void;
  run: (manager: T) => Promise<void>;
  close: (manager: T) => Promise<void>;
  onCloseError?: (err: unknown) => void;
}): Promise<void> {
  const { manager, error } = await params.getManager();
  if (!manager) {
    params.onMissing(error);
    return;
  }
  try {
    await params.run(manager);
  } finally {
    try {
      await params.close(manager);
    } catch (err) {
      params.onCloseError?.(err);
    }
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runCommandWithRuntime(
  runtime: { error: (message: string) => void; exit: (code: number) => void },
  action: () => Promise<void>,
  onError?: (error: unknown) => void,
): Promise<void> {
  try {
    await action();
  } catch (err) {
    if (onError) {
      onError(err);
      return;
    }
    runtime.error(String(err));
    runtime.exit(1);
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveOptionFromCommand<T>(
  command: Command | undefined,
  key: string,
): T | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let current: Command | null | undefined = command;
  while (current) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const opts = current.opts?.() ?? {};
    if (opts[key] !== undefined) {
      return opts[key];
    }
    current = current.parent ?? undefined;
  }
  return undefined;
}
