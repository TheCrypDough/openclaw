/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/rest-fetch.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { ProxyAgent, fetch as undiciFetch } from "undici";
import { danger } from "../../globals.js";
import { wrapFetchWithAbortSignal } from "../../infra/fetch.js";
import type { RuntimeEnv } from "../../runtime.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDiscordRestFetch(
  proxyUrl: string | undefined,
  runtime: RuntimeEnv,
): typeof fetch {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const proxy = proxyUrl?.trim();
  if (!proxy) {
    return fetch;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agent = new ProxyAgent(proxy);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fetcher = ((input: RequestInfo | URL, init?: RequestInit) =>
      undiciFetch(input as string | URL, {
        ...(init as Record<string, unknown>),
        dispatcher: agent,
      }) as unknown as Promise<Response>) as typeof fetch;
    runtime.log?.("discord: rest proxy enabled");
    return wrapFetchWithAbortSignal(fetcher);
  } catch (err) {
    runtime.error?.(danger(`discord: invalid rest proxy: ${String(err)}`));
    return fetch;
  }
}
