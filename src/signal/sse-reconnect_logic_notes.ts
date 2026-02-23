/*
 * AUTO ANNOTATION
 * File: src/signal/sse-reconnect.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { logVerbose, shouldLogVerbose } from "../globals.js";
import type { BackoffPolicy } from "../infra/backoff.js";
import { computeBackoff, sleepWithAbort } from "../infra/backoff.js";
import type { RuntimeEnv } from "../runtime.js";
import { type SignalSseEvent, streamSignalEvents } from "./client.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_RECONNECT_POLICY: BackoffPolicy = {
  initialMs: 1_000,
  maxMs: 10_000,
  factor: 2,
  jitter: 0.2,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type RunSignalSseLoopParams = {
  baseUrl: string;
  account?: string;
  abortSignal?: AbortSignal;
  runtime: RuntimeEnv;
  onEvent: (event: SignalSseEvent) => void;
  policy?: Partial<BackoffPolicy>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runSignalSseLoop({
  baseUrl,
  account,
  abortSignal,
  runtime,
  onEvent,
  policy,
}: RunSignalSseLoopParams) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const reconnectPolicy = {
    ...DEFAULT_RECONNECT_POLICY,
    ...policy,
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let reconnectAttempts = 0;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const logReconnectVerbose = (message: string) => {
    if (!shouldLogVerbose()) {
      return;
    }
    logVerbose(message);
  };

  while (!abortSignal?.aborted) {
    try {
      await streamSignalEvents({
        baseUrl,
        account,
        abortSignal,
        onEvent: (event) => {
          reconnectAttempts = 0;
          onEvent(event);
        },
      });
      if (abortSignal?.aborted) {
        return;
      }
      reconnectAttempts += 1;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const delayMs = computeBackoff(reconnectPolicy, reconnectAttempts);
      logReconnectVerbose(`Signal SSE stream ended, reconnecting in ${delayMs / 1000}s...`);
      await sleepWithAbort(delayMs, abortSignal);
    } catch (err) {
      if (abortSignal?.aborted) {
        return;
      }
      runtime.error?.(`Signal SSE stream error: ${String(err)}`);
      reconnectAttempts += 1;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const delayMs = computeBackoff(reconnectPolicy, reconnectAttempts);
      runtime.log?.(`Signal SSE connection lost, reconnecting in ${delayMs / 1000}s...`);
      try {
        await sleepWithAbort(delayMs, abortSignal);
      } catch (sleepErr) {
        if (abortSignal?.aborted) {
          return;
        }
        throw sleepErr;
      }
    }
  }
}
