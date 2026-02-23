/*
 * AUTO ANNOTATION
 * File: src/providers/github-copilot-models.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ModelDefinitionConfig } from "../config/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_CONTEXT_WINDOW = 128_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_MAX_TOKENS = 8192;

// Copilot model ids vary by plan/org and can change.
// We keep this list intentionally broad; if a model isn't available Copilot will
// return an error and users can remove it from their config.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_MODEL_IDS = [
  "claude-sonnet-4.6",
  "claude-sonnet-4.5",
  "gpt-4o",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "o1",
  "o1-mini",
  "o3-mini",
] as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getDefaultCopilotModelIds(): string[] {
  return [...DEFAULT_MODEL_IDS];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildCopilotModelDefinition(modelId: string): ModelDefinitionConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const id = modelId.trim();
  if (!id) {
    throw new Error("Model id required");
  }
  return {
    id,
    name: id,
    // pi-coding-agent's registry schema doesn't know about a "github-copilot" API.
    // We use OpenAI-compatible responses API, while keeping the provider id as
    // "github-copilot" (pi-ai uses that to attach Copilot-specific headers).
    api: "openai-responses",
    reasoning: false,
    input: ["text", "image"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: DEFAULT_CONTEXT_WINDOW,
    maxTokens: DEFAULT_MAX_TOKENS,
  };
}
