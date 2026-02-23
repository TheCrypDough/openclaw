/*
 * AUTO ANNOTATION
 * File: src/memory/batch-upload.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  buildBatchHeaders,
  normalizeBatchBaseUrl,
  type BatchHttpClientConfig,
} from "./batch-utils.js";
import { hashText } from "./internal.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function uploadBatchJsonlFile(params: {
  client: BatchHttpClientConfig;
  requests: unknown[];
  errorPrefix: string;
}): Promise<string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseUrl = normalizeBatchBaseUrl(params.client);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const jsonl = params.requests.map((request) => JSON.stringify(request)).join("\n");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const form = new FormData();
  form.append("purpose", "batch");
  form.append(
    "file",
    new Blob([jsonl], { type: "application/jsonl" }),
    `memory-embeddings.${hashText(String(Date.now()))}.jsonl`,
  );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fileRes = await fetch(`${baseUrl}/files`, {
    method: "POST",
    headers: buildBatchHeaders(params.client, { json: false }),
    body: form,
  });
  if (!fileRes.ok) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = await fileRes.text();
    throw new Error(`${params.errorPrefix}: ${fileRes.status} ${text}`);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const filePayload = (await fileRes.json()) as { id?: string };
  if (!filePayload.id) {
    throw new Error(`${params.errorPrefix}: missing file id`);
  }
  return filePayload.id;
}
