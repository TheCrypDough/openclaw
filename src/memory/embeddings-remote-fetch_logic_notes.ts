/*
 * AUTO ANNOTATION
 * File: src/memory/embeddings-remote-fetch.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function fetchRemoteEmbeddingVectors(params: {
  url: string;
  headers: Record<string, string>;
  body: unknown;
  errorPrefix: string;
}): Promise<number[][]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = await fetch(params.url, {
    method: "POST",
    headers: params.headers,
    body: JSON.stringify(params.body),
  });
  if (!res.ok) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = await res.text();
    throw new Error(`${params.errorPrefix}: ${res.status} ${text}`);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payload = (await res.json()) as {
    data?: Array<{ embedding?: number[] }>;
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const data = payload.data ?? [];
  return data.map((entry) => entry.embedding ?? []);
}
