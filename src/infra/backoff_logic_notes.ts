/*
 * AUTO ANNOTATION
 * File: src/infra/backoff.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { setTimeout as delay } from "node:timers/promises";

export type BackoffPolicy = {
  initialMs: number;
  maxMs: number;
  factor: number;
  jitter: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function computeBackoff(policy: BackoffPolicy, attempt: number) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = policy.initialMs * policy.factor ** Math.max(attempt - 1, 0);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const jitter = base * policy.jitter * Math.random();
  return Math.min(policy.maxMs, Math.round(base + jitter));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function sleepWithAbort(ms: number, abortSignal?: AbortSignal) {
  if (ms <= 0) {
    return;
  }
  try {
    await delay(ms, undefined, { signal: abortSignal });
  } catch (err) {
    if (abortSignal?.aborted) {
      throw new Error("aborted", { cause: err });
    }
    throw err;
  }
}
