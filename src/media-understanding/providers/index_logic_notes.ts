/*
 * AUTO ANNOTATION
 * File: src/media-understanding/providers/index.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeProviderId } from "../../agents/model-selection.js";
import type { MediaUnderstandingProvider } from "../types.js";
import { anthropicProvider } from "./anthropic/index.js";
import { deepgramProvider } from "./deepgram/index.js";
import { googleProvider } from "./google/index.js";
import { groqProvider } from "./groq/index.js";
import { minimaxProvider } from "./minimax/index.js";
import { openaiProvider } from "./openai/index.js";
import { zaiProvider } from "./zai/index.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const PROVIDERS: MediaUnderstandingProvider[] = [
  groqProvider,
  openaiProvider,
  googleProvider,
  anthropicProvider,
  minimaxProvider,
  zaiProvider,
  deepgramProvider,
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeMediaProviderId(id: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeProviderId(id);
  if (normalized === "gemini") {
    return "google";
  }
  return normalized;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildMediaUnderstandingRegistry(
  overrides?: Record<string, MediaUnderstandingProvider>,
): Map<string, MediaUnderstandingProvider> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const registry = new Map<string, MediaUnderstandingProvider>();
  for (const provider of PROVIDERS) {
    registry.set(normalizeMediaProviderId(provider.id), provider);
  }
  if (overrides) {
    for (const [key, provider] of Object.entries(overrides)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const normalizedKey = normalizeMediaProviderId(key);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const existing = registry.get(normalizedKey);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const merged = existing
        ? {
            ...existing,
            ...provider,
            capabilities: provider.capabilities ?? existing.capabilities,
          }
        : provider;
      registry.set(normalizedKey, merged);
    }
  }
  return registry;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getMediaUnderstandingProvider(
  id: string,
  registry: Map<string, MediaUnderstandingProvider>,
): MediaUnderstandingProvider | undefined {
  return registry.get(normalizeMediaProviderId(id));
}
