/*
 * AUTO ANNOTATION
 * File: src/memory/test-embeddings-mock.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createOpenAIEmbeddingProviderMock(params: {
  embedQuery: (input: string) => Promise<number[]>;
  embedBatch: (input: string[]) => Promise<number[][]>;
}) {
  return {
    requestedProvider: "openai",
    provider: {
      id: "openai",
      model: "text-embedding-3-small",
      embedQuery: params.embedQuery,
      embedBatch: params.embedBatch,
    },
    openAi: {
      baseUrl: "https://api.openai.com/v1",
      headers: { Authorization: "Bearer test", "Content-Type": "application/json" },
      model: "text-embedding-3-small",
    },
  };
}
