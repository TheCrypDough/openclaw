/*
 * AUTO ANNOTATION
 * File: src/test-utils/fetch-mock.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type FetchMock = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type FetchPreconnectOptions = {
  dns?: boolean;
  tcp?: boolean;
  http?: boolean;
  https?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type FetchWithPreconnect = {
  preconnect: (url: string | URL, options?: FetchPreconnectOptions) => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function withFetchPreconnect<T extends typeof fetch>(fn: T): T & FetchWithPreconnect;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function withFetchPreconnect<T extends object>(
  fn: T,
): T & FetchWithPreconnect & typeof fetch;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function withFetchPreconnect(fn: object) {
  return Object.assign(fn, {
    preconnect: (_url: string | URL, _options?: FetchPreconnectOptions) => {},
  });
}
