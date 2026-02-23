/*
 * AUTO ANNOTATION
 * File: src/utils/fetch-timeout.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Relay abort without forwarding the Event argument as the abort reason.
 * Using .bind() avoids closure scope capture (memory leak prevention).
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function relayAbort(this: AbortController) {
  this.abort();
}

/** Returns a bound abort relay for use as an event listener. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function bindAbortRelay(controller: AbortController): () => void {
  return relayAbort.bind(controller);
}

/**
 * Fetch wrapper that adds timeout support via AbortController.
 *
 * @param url - The URL to fetch
 * @param init - RequestInit options (headers, method, body, etc.)
 * @param timeoutMs - Timeout in milliseconds
 * @param fetchFn - The fetch implementation to use (defaults to global fetch)
 * @returns The fetch Response
 * @throws AbortError if the request times out
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  fetchFn: typeof fetch = fetch,
): Promise<Response> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const controller = new AbortController();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const timer = setTimeout(controller.abort.bind(controller), Math.max(1, timeoutMs));
  try {
    return await fetchFn(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
