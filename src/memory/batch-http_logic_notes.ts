/*
 * AUTO ANNOTATION
 * File: src/memory/batch-http.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { retryAsync } from "../infra/retry.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function postJsonWithRetry<T>(params: {
  url: string;
  headers: Record<string, string>;
  body: unknown;
  errorPrefix: string;
}): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = await retryAsync(
    async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await fetch(params.url, {
        method: "POST",
        headers: params.headers,
        body: JSON.stringify(params.body),
      });
      if (!res.ok) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const text = await res.text();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const err = new Error(`${params.errorPrefix}: ${res.status} ${text}`) as Error & {
          status?: number;
        };
        err.status = res.status;
        throw err;
      }
      return res;
    },
    {
      attempts: 3,
      minDelayMs: 300,
      maxDelayMs: 2000,
      jitter: 0.2,
      shouldRetry: (err) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const status = (err as { status?: number }).status;
        return status === 429 || (typeof status === "number" && status >= 500);
      },
    },
  );
  return (await res.json()) as T;
}
