/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/urbit/fetch.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { LookupFn, SsrFPolicy } from "openclaw/plugin-sdk";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk";
import { validateUrbitBaseUrl } from "./base-url.js";
import { UrbitUrlError } from "./errors.js";

export type UrbitFetchOptions = {
  baseUrl: string;
  path: string;
  init?: RequestInit;
  ssrfPolicy?: SsrFPolicy;
  lookupFn?: LookupFn;
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  timeoutMs?: number;
  maxRedirects?: number;
  signal?: AbortSignal;
  auditContext?: string;
  pinDns?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function urbitFetch(params: UrbitFetchOptions) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const validated = validateUrbitBaseUrl(params.baseUrl);
  if (!validated.ok) {
    throw new UrbitUrlError(validated.error);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const url = new URL(params.path, validated.baseUrl).toString();
  return await fetchWithSsrFGuard({
    url,
    fetchImpl: params.fetchImpl,
    init: params.init,
    timeoutMs: params.timeoutMs,
    maxRedirects: params.maxRedirects,
    signal: params.signal,
    policy: params.ssrfPolicy,
    lookupFn: params.lookupFn,
    auditContext: params.auditContext,
    pinDns: params.pinDns,
  });
}
