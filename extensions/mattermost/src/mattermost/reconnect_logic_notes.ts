/*
 * AUTO ANNOTATION
 * File: extensions/mattermost/src/mattermost/reconnect.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type ReconnectOutcome = "resolved" | "rejected";

export type ShouldReconnectParams = {
  attempt: number;
  delayMs: number;
  outcome: ReconnectOutcome;
  error?: unknown;
};

export type RunWithReconnectOpts = {
  abortSignal?: AbortSignal;
  onError?: (err: unknown) => void;
  onReconnect?: (delayMs: number) => void;
  initialDelayMs?: number;
  maxDelayMs?: number;
  jitterRatio?: number;
  random?: () => number;
  shouldReconnect?: (params: ShouldReconnectParams) => boolean;
};

/**
 * Reconnection loop with exponential backoff.
 *
 * Calls `connectFn` in a while loop. On normal resolve (connection closed),
 * the backoff resets. On thrown error (connection failed), the current delay is
 * used, then doubled for the next retry.
 * The loop exits when `abortSignal` fires.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runWithReconnect(
  connectFn: () => Promise<void>,
  opts: RunWithReconnectOpts = {},
): Promise<void> {
  const { initialDelayMs = 2000, maxDelayMs = 60_000 } = opts;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const jitterRatio = Math.max(0, opts.jitterRatio ?? 0);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const random = opts.random ?? Math.random;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let retryDelay = initialDelayMs;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let attempt = 0;

  while (!opts.abortSignal?.aborted) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let shouldIncreaseDelay = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let outcome: ReconnectOutcome = "resolved";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let error: unknown;
    try {
      await connectFn();
      retryDelay = initialDelayMs;
    } catch (err) {
      if (opts.abortSignal?.aborted) {
        return;
      }
      outcome = "rejected";
      error = err;
      opts.onError?.(err);
      shouldIncreaseDelay = true;
    }
    if (opts.abortSignal?.aborted) {
      return;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const delayMs = withJitter(retryDelay, jitterRatio, random);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const shouldReconnect =
      opts.shouldReconnect?.({
        attempt,
        delayMs,
        outcome,
        error,
      }) ?? true;
    if (!shouldReconnect) {
      return;
    }
    opts.onReconnect?.(delayMs);
    await sleepAbortable(delayMs, opts.abortSignal);
    if (shouldIncreaseDelay) {
      retryDelay = Math.min(retryDelay * 2, maxDelayMs);
    }
    attempt++;
  }
}

function withJitter(baseMs: number, jitterRatio: number, random: () => number): number {
  if (jitterRatio <= 0) {
    return baseMs;
  }
  const normalized = Math.max(0, Math.min(1, random()));
  const spread = baseMs * jitterRatio;
  return Math.max(1, Math.round(baseMs - spread + normalized * spread * 2));
}

function sleepAbortable(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
