/*
 * AUTO ANNOTATION
 * File: src/memory/embedding-chunk-limits.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { estimateUtf8Bytes, splitTextToUtf8ByteLimit } from "./embedding-input-limits.js";
import { resolveEmbeddingMaxInputTokens } from "./embedding-model-limits.js";
import type { EmbeddingProvider } from "./embeddings.js";
import { hashText, type MemoryChunk } from "./internal.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function enforceEmbeddingMaxInputTokens(
  provider: EmbeddingProvider,
  chunks: MemoryChunk[],
): MemoryChunk[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxInputTokens = resolveEmbeddingMaxInputTokens(provider);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const out: MemoryChunk[] = [];

  for (const chunk of chunks) {
    if (estimateUtf8Bytes(chunk.text) <= maxInputTokens) {
      out.push(chunk);
      continue;
    }

    for (const text of splitTextToUtf8ByteLimit(chunk.text, maxInputTokens)) {
      out.push({
        startLine: chunk.startLine,
        endLine: chunk.endLine,
        text,
        hash: hashText(text),
      });
    }
  }

  return out;
}
