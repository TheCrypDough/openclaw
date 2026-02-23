/*
 * AUTO ANNOTATION
 * File: src/agents/transcript-policy.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeProviderId } from "./model-selection.js";
import { isAntigravityClaude, isGoogleModelApi } from "./pi-embedded-helpers/google.js";
import type { ToolCallIdMode } from "./tool-call-id.js";

export type TranscriptSanitizeMode = "full" | "images-only";

export type TranscriptPolicy = {
  sanitizeMode: TranscriptSanitizeMode;
  sanitizeToolCallIds: boolean;
  toolCallIdMode?: ToolCallIdMode;
  repairToolUseResultPairing: boolean;
  preserveSignatures: boolean;
  sanitizeThoughtSignatures?: {
    allowBase64Only?: boolean;
    includeCamelCase?: boolean;
  };
  sanitizeThinkingSignatures: boolean;
  dropThinkingBlocks: boolean;
  applyGoogleTurnOrdering: boolean;
  validateGeminiTurns: boolean;
  validateAnthropicTurns: boolean;
  allowSyntheticToolResults: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MISTRAL_MODEL_HINTS = [
  "mistral",
  "mixtral",
  "codestral",
  "pixtral",
  "devstral",
  "ministral",
  "mistralai",
];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OPENAI_MODEL_APIS = new Set([
  "openai",
  "openai-completions",
  "openai-responses",
  "openai-codex-responses",
]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OPENAI_PROVIDERS = new Set(["openai", "openai-codex"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isOpenAiApi(modelApi?: string | null): boolean {
  if (!modelApi) {
    return false;
  }
  return OPENAI_MODEL_APIS.has(modelApi);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isOpenAiProvider(provider?: string | null): boolean {
  if (!provider) {
    return false;
  }
  return OPENAI_PROVIDERS.has(normalizeProviderId(provider));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isAnthropicApi(modelApi?: string | null, provider?: string | null): boolean {
  if (modelApi === "anthropic-messages") {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeProviderId(provider ?? "");
  // MiniMax now uses openai-completions API, not anthropic-messages
  return normalized === "anthropic";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isMistralModel(params: { provider?: string | null; modelId?: string | null }): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const provider = normalizeProviderId(params.provider ?? "");
  if (provider === "mistral") {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const modelId = (params.modelId ?? "").toLowerCase();
  if (!modelId) {
    return false;
  }
  return MISTRAL_MODEL_HINTS.some((hint) => modelId.includes(hint));
}

export function resolveTranscriptPolicy(params: {
  modelApi?: string | null;
  provider?: string | null;
  modelId?: string | null;
}): TranscriptPolicy {
  const provider = normalizeProviderId(params.provider ?? "");
  const modelId = params.modelId ?? "";
  const isGoogle = isGoogleModelApi(params.modelApi);
  const isAnthropic = isAnthropicApi(params.modelApi, provider);
  const isOpenAi = isOpenAiProvider(provider) || (!provider && isOpenAiApi(params.modelApi));
  const isMistral = isMistralModel({ provider, modelId });
  const isOpenRouterGemini =
    (provider === "openrouter" || provider === "opencode") &&
    modelId.toLowerCase().includes("gemini");
  const isAntigravityClaudeModel = isAntigravityClaude({
    api: params.modelApi,
    provider,
    modelId,
  });

  const isCopilotClaude = provider === "github-copilot" && modelId.toLowerCase().includes("claude");

  // GitHub Copilot's Claude endpoints can reject persisted `thinking` blocks with
  // non-binary/non-base64 signatures (e.g. thinkingSignature: "reasoning_text").
  // Drop these blocks at send-time to keep sessions usable.
  const dropThinkingBlocks = isCopilotClaude;

  const needsNonImageSanitize = isGoogle || isAnthropic || isMistral || isOpenRouterGemini;

  const sanitizeToolCallIds = isGoogle || isMistral || isAnthropic;
  const toolCallIdMode: ToolCallIdMode | undefined = isMistral
    ? "strict9"
    : sanitizeToolCallIds
      ? "strict"
      : undefined;
  const repairToolUseResultPairing = isGoogle || isAnthropic;
  const sanitizeThoughtSignatures = isOpenRouterGemini
    ? { allowBase64Only: true, includeCamelCase: true }
    : undefined;
  const sanitizeThinkingSignatures = isAntigravityClaudeModel;

  return {
    sanitizeMode: isOpenAi ? "images-only" : needsNonImageSanitize ? "full" : "images-only",
    sanitizeToolCallIds: !isOpenAi && sanitizeToolCallIds,
    toolCallIdMode,
    repairToolUseResultPairing: !isOpenAi && repairToolUseResultPairing,
    preserveSignatures: isAntigravityClaudeModel,
    sanitizeThoughtSignatures: isOpenAi ? undefined : sanitizeThoughtSignatures,
    sanitizeThinkingSignatures,
    dropThinkingBlocks,
    applyGoogleTurnOrdering: !isOpenAi && isGoogle,
    validateGeminiTurns: !isOpenAi && isGoogle,
    validateAnthropicTurns: !isOpenAi && isAnthropic,
    allowSyntheticToolResults: !isOpenAi && (isGoogle || isAnthropic),
  };
}
