/*
 * AUTO ANNOTATION
 * File: src/memory/embeddings-openai.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveRemoteEmbeddingBearerClient } from "./embeddings-remote-client.js";
import { fetchRemoteEmbeddingVectors } from "./embeddings-remote-fetch.js";
import type { EmbeddingProvider, EmbeddingProviderOptions } from "./embeddings.js";

export type OpenAiEmbeddingClient = {
  baseUrl: string;
  headers: Record<string, string>;
  model: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_OPENAI_EMBEDDING_MODEL = "text-embedding-3-small";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OPENAI_MAX_INPUT_TOKENS: Record<string, number> = {
  "text-embedding-3-small": 8192,
  "text-embedding-3-large": 8192,
  "text-embedding-ada-002": 8191,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeOpenAiModel(model: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = model.trim();
  if (!trimmed) {
    return DEFAULT_OPENAI_EMBEDDING_MODEL;
  }
  if (trimmed.startsWith("openai/")) {
    return trimmed.slice("openai/".length);
  }
  return trimmed;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function createOpenAiEmbeddingProvider(
  options: EmbeddingProviderOptions,
): Promise<{ provider: EmbeddingProvider; client: OpenAiEmbeddingClient }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const client = await resolveOpenAiEmbeddingClient(options);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const url = `${client.baseUrl.replace(/\/$/, "")}/embeddings`;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const embed = async (input: string[]): Promise<number[][]> => {
    if (input.length === 0) {
      return [];
    }
    return await fetchRemoteEmbeddingVectors({
      url,
      headers: client.headers,
      body: { model: client.model, input },
      errorPrefix: "openai embeddings failed",
    });
  };

  return {
    provider: {
      id: "openai",
      model: client.model,
      maxInputTokens: OPENAI_MAX_INPUT_TOKENS[client.model],
      embedQuery: async (text) => {
        const [vec] = await embed([text]);
        return vec ?? [];
      },
      embedBatch: embed,
    },
    client,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveOpenAiEmbeddingClient(
  options: EmbeddingProviderOptions,
): Promise<OpenAiEmbeddingClient> {
  const { baseUrl, headers } = await resolveRemoteEmbeddingBearerClient({
    provider: "openai",
    options,
    defaultBaseUrl: DEFAULT_OPENAI_BASE_URL,
  });
  const model = normalizeOpenAiModel(options.model);
  return { baseUrl, headers, model };
}
