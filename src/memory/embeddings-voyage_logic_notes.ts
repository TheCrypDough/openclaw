/*
 * AUTO ANNOTATION
 * File: src/memory/embeddings-voyage.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveRemoteEmbeddingBearerClient } from "./embeddings-remote-client.js";
import { fetchRemoteEmbeddingVectors } from "./embeddings-remote-fetch.js";
import type { EmbeddingProvider, EmbeddingProviderOptions } from "./embeddings.js";

export type VoyageEmbeddingClient = {
  baseUrl: string;
  headers: Record<string, string>;
  model: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_VOYAGE_EMBEDDING_MODEL = "voyage-4-large";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_VOYAGE_BASE_URL = "https://api.voyageai.com/v1";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const VOYAGE_MAX_INPUT_TOKENS: Record<string, number> = {
  "voyage-3": 32000,
  "voyage-3-lite": 16000,
  "voyage-code-3": 32000,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeVoyageModel(model: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = model.trim();
  if (!trimmed) {
    return DEFAULT_VOYAGE_EMBEDDING_MODEL;
  }
  if (trimmed.startsWith("voyage/")) {
    return trimmed.slice("voyage/".length);
  }
  return trimmed;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function createVoyageEmbeddingProvider(
  options: EmbeddingProviderOptions,
): Promise<{ provider: EmbeddingProvider; client: VoyageEmbeddingClient }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const client = await resolveVoyageEmbeddingClient(options);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const url = `${client.baseUrl.replace(/\/$/, "")}/embeddings`;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const embed = async (input: string[], input_type?: "query" | "document"): Promise<number[][]> => {
    if (input.length === 0) {
      return [];
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const body: { model: string; input: string[]; input_type?: "query" | "document" } = {
      model: client.model,
      input,
    };
    if (input_type) {
      body.input_type = input_type;
    }

    return await fetchRemoteEmbeddingVectors({
      url,
      headers: client.headers,
      body,
      errorPrefix: "voyage embeddings failed",
    });
  };

  return {
    provider: {
      id: "voyage",
      model: client.model,
      maxInputTokens: VOYAGE_MAX_INPUT_TOKENS[client.model],
      embedQuery: async (text) => {
        const [vec] = await embed([text], "query");
        return vec ?? [];
      },
      embedBatch: async (texts) => embed(texts, "document"),
    },
    client,
  };
}

export async function resolveVoyageEmbeddingClient(
  options: EmbeddingProviderOptions,
): Promise<VoyageEmbeddingClient> {
  const { baseUrl, headers } = await resolveRemoteEmbeddingBearerClient({
    provider: "voyage",
    options,
    defaultBaseUrl: DEFAULT_VOYAGE_BASE_URL,
  });
  const model = normalizeVoyageModel(options.model);
  return { baseUrl, headers, model };
}
