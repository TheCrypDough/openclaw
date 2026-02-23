/*
 * AUTO ANNOTATION
 * File: src/media-understanding/providers/shared.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { GuardedFetchResult } from "../../infra/net/fetch-guard.js";
import { fetchWithSsrFGuard } from "../../infra/net/fetch-guard.js";
import type { LookupFn, SsrFPolicy } from "../../infra/net/ssrf.js";
export { fetchWithTimeout } from "../../utils/fetch-timeout.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MAX_ERROR_CHARS = 300;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeBaseUrl(baseUrl: string | undefined, fallback: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = baseUrl?.trim() || fallback;
  return raw.replace(/\/+$/, "");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function fetchWithTimeoutGuarded(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  fetchFn: typeof fetch,
  options?: {
    ssrfPolicy?: SsrFPolicy;
    lookupFn?: LookupFn;
    pinDns?: boolean;
  },
): Promise<GuardedFetchResult> {
  return await fetchWithSsrFGuard({
    url,
    fetchImpl: fetchFn,
    init,
    timeoutMs,
    policy: options?.ssrfPolicy,
    lookupFn: options?.lookupFn,
    pinDns: options?.pinDns,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function readErrorResponse(res: Response): Promise<string | undefined> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = await res.text();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const collapsed = text.replace(/\s+/g, " ").trim();
    if (!collapsed) {
      return undefined;
    }
    if (collapsed.length <= MAX_ERROR_CHARS) {
      return collapsed;
    }
    return `${collapsed.slice(0, MAX_ERROR_CHARS)}…`;
  } catch {
    return undefined;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function assertOkOrThrowHttpError(res: Response, label: string): Promise<void> {
  if (res.ok) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const detail = await readErrorResponse(res);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const suffix = detail ? `: ${detail}` : "";
  throw new Error(`${label} (HTTP ${res.status})${suffix}`);
}
