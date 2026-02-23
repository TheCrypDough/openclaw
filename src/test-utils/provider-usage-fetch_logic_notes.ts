/*
 * AUTO ANNOTATION
 * File: src/test-utils/provider-usage-fetch.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";
import { withFetchPreconnect } from "./fetch-mock.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type UsageFetchInput = string | Request | URL;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type UsageFetchHandler = (url: string, init?: RequestInit) => Promise<Response> | Response;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type UsageFetchMock = ReturnType<
  typeof vi.fn<(input: UsageFetchInput, init?: RequestInit) => Promise<Response>>
>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function makeResponse(status: number, body: unknown): Response {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payload = typeof body === "string" ? body : JSON.stringify(body);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const headers = typeof body === "string" ? undefined : { "Content-Type": "application/json" };
  return new Response(payload, { status, headers });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function toRequestUrl(input: UsageFetchInput): string {
  return typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createProviderUsageFetch(
  handler: UsageFetchHandler,
): typeof fetch & UsageFetchMock {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mockFetch = vi.fn(async (input: UsageFetchInput, init?: RequestInit) =>
    handler(toRequestUrl(input), init),
  );
  return withFetchPreconnect(mockFetch) as typeof fetch & UsageFetchMock;
}
