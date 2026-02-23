/*
 * AUTO ANNOTATION
 * File: extensions/zalo/src/proxy.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Dispatcher, RequestInit as UndiciRequestInit } from "undici";
import { ProxyAgent, fetch as undiciFetch } from "undici";
import type { ZaloFetch } from "./api.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const proxyCache = new Map<string, ZaloFetch>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveZaloProxyFetch(proxyUrl?: string | null): ZaloFetch | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = proxyUrl?.trim();
  if (!trimmed) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cached = proxyCache.get(trimmed);
  if (cached) {
    return cached;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agent = new ProxyAgent(trimmed);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fetcher: ZaloFetch = (input, init) =>
    undiciFetch(input, {
      ...init,
      dispatcher: agent,
    } as UndiciRequestInit) as unknown as Promise<Response>;
  proxyCache.set(trimmed, fetcher);
  return fetcher;
}
