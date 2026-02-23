/*
 * AUTO ANNOTATION
 * File: src/telegram/proxy.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { ProxyAgent, fetch as undiciFetch } from "undici";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function makeProxyFetch(proxyUrl: string): typeof fetch {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agent = new ProxyAgent(proxyUrl);
  // undici's fetch is runtime-compatible with global fetch but the types diverge
  // on stream/body internals. Single cast at the boundary keeps the rest type-safe.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fetcher = ((input: RequestInfo | URL, init?: RequestInit) =>
    undiciFetch(input as string | URL, {
      ...(init as Record<string, unknown>),
      dispatcher: agent,
    }) as unknown as Promise<Response>) as typeof fetch;
  // Return raw proxy fetch; call sites that need AbortSignal normalization
  // should opt into resolveFetch/wrapFetchWithAbortSignal once at the edge.
  return fetcher;
}
