/*
 * AUTO ANNOTATION
 * File: src/infra/transport-ready.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { danger } from "../globals.js";
import type { RuntimeEnv } from "../runtime.js";
import { sleepWithAbort } from "./backoff.js";

export type TransportReadyResult = {
  ok: boolean;
  error?: string | null;
};

export type WaitForTransportReadyParams = {
  label: string;
  timeoutMs: number;
  logAfterMs?: number;
  logIntervalMs?: number;
  pollIntervalMs?: number;
  abortSignal?: AbortSignal;
  runtime: RuntimeEnv;
  check: () => Promise<TransportReadyResult>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function waitForTransportReady(params: WaitForTransportReadyParams): Promise<void> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const started = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const timeoutMs = Math.max(0, params.timeoutMs);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const deadline = started + timeoutMs;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const logAfterMs = Math.max(0, params.logAfterMs ?? timeoutMs);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const logIntervalMs = Math.max(1_000, params.logIntervalMs ?? 30_000);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pollIntervalMs = Math.max(50, params.pollIntervalMs ?? 150);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let nextLogAt = started + logAfterMs;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let lastError: string | null = null;

  while (true) {
    if (params.abortSignal?.aborted) {
      return;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await params.check();
    if (res.ok) {
      return;
    }
    lastError = res.error ?? null;

    const now = Date.now();
    if (now >= deadline) {
      break;
    }
    if (now >= nextLogAt) {
      const elapsedMs = now - started;
      params.runtime.error?.(
        danger(`${params.label} not ready after ${elapsedMs}ms (${lastError ?? "unknown error"})`),
      );
      nextLogAt = now + logIntervalMs;
    }

    try {
      await sleepWithAbort(pollIntervalMs, params.abortSignal);
    } catch (err) {
      if (params.abortSignal?.aborted) {
        return;
      }
      throw err;
    }
  }

  params.runtime.error?.(
    danger(`${params.label} not ready after ${timeoutMs}ms (${lastError ?? "unknown error"})`),
  );
  throw new Error(`${params.label} not ready (${lastError ?? "unknown error"})`);
}
