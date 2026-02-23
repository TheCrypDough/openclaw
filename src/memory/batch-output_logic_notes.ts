/*
 * AUTO ANNOTATION
 * File: src/memory/batch-output.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type EmbeddingBatchOutputLine = {
  custom_id?: string;
  error?: { message?: string };
  response?: {
    status_code?: number;
    body?:
      | {
          data?: Array<{
            embedding?: number[];
          }>;
          error?: { message?: string };
        }
      | string;
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyEmbeddingBatchOutputLine(params: {
  line: EmbeddingBatchOutputLine;
  remaining: Set<string>;
  errors: string[];
  byCustomId: Map<string, number[]>;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const customId = params.line.custom_id;
  if (!customId) {
    return;
  }
  params.remaining.delete(customId);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const errorMessage = params.line.error?.message;
  if (errorMessage) {
    params.errors.push(`${customId}: ${errorMessage}`);
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const response = params.line.response;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const statusCode = response?.status_code ?? 0;
  if (statusCode >= 400) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const messageFromObject =
      response?.body && typeof response.body === "object"
        ? (response.body as { error?: { message?: string } }).error?.message
        : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const messageFromString = typeof response?.body === "string" ? response.body : undefined;
    params.errors.push(`${customId}: ${messageFromObject ?? messageFromString ?? "unknown error"}`);
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const data =
    response?.body && typeof response.body === "object" ? (response.body.data ?? []) : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const embedding = data[0]?.embedding ?? [];
  if (embedding.length === 0) {
    params.errors.push(`${customId}: empty embedding`);
    return;
  }
  params.byCustomId.set(customId, embedding);
}
