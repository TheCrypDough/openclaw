/*
 * AUTO ANNOTATION
 * File: src/memory/embedding-model-limits.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { EmbeddingProvider } from "./embeddings.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_EMBEDDING_MAX_INPUT_TOKENS = 8192;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const KNOWN_EMBEDDING_MAX_INPUT_TOKENS: Record<string, number> = {
  "openai:text-embedding-3-small": 8192,
  "openai:text-embedding-3-large": 8192,
  "openai:text-embedding-ada-002": 8191,
  "gemini:text-embedding-004": 2048,
  "voyage:voyage-3": 32000,
  "voyage:voyage-3-lite": 16000,
  "voyage:voyage-code-3": 32000,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveEmbeddingMaxInputTokens(provider: EmbeddingProvider): number {
  if (typeof provider.maxInputTokens === "number") {
    return provider.maxInputTokens;
  }

  // Provider/model mapping is best-effort; different providers use different
  // limits and we prefer to be conservative when we don't know.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = `${provider.id}:${provider.model}`.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const known = KNOWN_EMBEDDING_MAX_INPUT_TOKENS[key];
  if (typeof known === "number") {
    return known;
  }

  // Provider-specific conservative fallbacks. This prevents us from accidentally
  // using the OpenAI default for providers with much smaller limits.
  if (provider.id.toLowerCase() === "gemini") {
    return 2048;
  }

  return DEFAULT_EMBEDDING_MAX_INPUT_TOKENS;
}
