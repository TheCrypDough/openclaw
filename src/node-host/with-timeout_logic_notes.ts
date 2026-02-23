/*
 * AUTO ANNOTATION
 * File: src/node-host/with-timeout.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withTimeout<T>(
  work: (signal: AbortSignal | undefined) => Promise<T>,
  timeoutMs?: number,
  label?: string,
): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved =
    typeof timeoutMs === "number" && Number.isFinite(timeoutMs)
      ? Math.max(1, Math.floor(timeoutMs))
      : undefined;
  if (!resolved) {
    return await work(undefined);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const abortCtrl = new AbortController();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const timeoutError = new Error(`${label ?? "request"} timed out`);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const timer = setTimeout(() => abortCtrl.abort(timeoutError), resolved);
  timer.unref?.();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let abortListener: (() => void) | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const abortPromise: Promise<never> = abortCtrl.signal.aborted
    ? Promise.reject(abortCtrl.signal.reason ?? timeoutError)
    : new Promise((_, reject) => {
        abortListener = () => reject(abortCtrl.signal.reason ?? timeoutError);
        abortCtrl.signal.addEventListener("abort", abortListener, { once: true });
      });

  try {
    return await Promise.race([work(abortCtrl.signal), abortPromise]);
  } finally {
    clearTimeout(timer);
    if (abortListener) {
      abortCtrl.signal.removeEventListener("abort", abortListener);
    }
  }
}
