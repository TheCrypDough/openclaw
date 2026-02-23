/*
 * AUTO ANNOTATION
 * File: src/cron/service/locked.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { CronServiceState } from "./state.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const storeLocks = new Map<string, Promise<void>>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const resolveChain = (promise: Promise<unknown>) =>
  promise.then(
    () => undefined,
    () => undefined,
  );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function locked<T>(state: CronServiceState, fn: () => Promise<T>): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storePath = state.deps.storePath;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storeOp = storeLocks.get(storePath) ?? Promise.resolve();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const next = Promise.all([resolveChain(state.op), resolveChain(storeOp)]).then(fn);

  // Keep the chain alive even when the operation fails.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const keepAlive = resolveChain(next);
  state.op = keepAlive;
  storeLocks.set(storePath, keepAlive);

  return (await next) as T;
}
