/*
 * AUTO ANNOTATION
 * File: src/memory/batch-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type BatchHttpClientConfig = {
  baseUrl?: string;
  headers?: Record<string, string>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeBatchBaseUrl(client: BatchHttpClientConfig): string {
  return client.baseUrl?.replace(/\/$/, "") ?? "";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildBatchHeaders(
  client: Pick<BatchHttpClientConfig, "headers">,
  params: { json: boolean },
): Record<string, string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const headers = client.headers ? { ...client.headers } : {};
  if (params.json) {
    if (!headers["Content-Type"] && !headers["content-type"]) {
      headers["Content-Type"] = "application/json";
    }
  } else {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }
  return headers;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function splitBatchRequests<T>(requests: T[], maxRequests: number): T[][] {
  if (requests.length <= maxRequests) {
    return [requests];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groups: T[][] = [];
  for (let i = 0; i < requests.length; i += maxRequests) {
    groups.push(requests.slice(i, i + maxRequests));
  }
  return groups;
}
