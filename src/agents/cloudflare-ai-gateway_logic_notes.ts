/*
 * AUTO ANNOTATION
 * File: src/agents/cloudflare-ai-gateway.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ModelDefinitionConfig } from "../config/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CLOUDFLARE_AI_GATEWAY_PROVIDER_ID = "cloudflare-ai-gateway";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_ID = "claude-sonnet-4-5";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF = `${CLOUDFLARE_AI_GATEWAY_PROVIDER_ID}/${CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_ID}`;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CLOUDFLARE_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW = 200_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CLOUDFLARE_AI_GATEWAY_DEFAULT_MAX_TOKENS = 64_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CLOUDFLARE_AI_GATEWAY_DEFAULT_COST = {
  input: 3,
  output: 15,
  cacheRead: 0.3,
  cacheWrite: 3.75,
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildCloudflareAiGatewayModelDefinition(params?: {
  id?: string;
  name?: string;
  reasoning?: boolean;
  input?: Array<"text" | "image">;
}): ModelDefinitionConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const id = params?.id?.trim() || CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_ID;
  return {
    id,
    name: params?.name ?? "Claude Sonnet 4.5",
    reasoning: params?.reasoning ?? true,
    input: params?.input ?? ["text", "image"],
    cost: CLOUDFLARE_AI_GATEWAY_DEFAULT_COST,
    contextWindow: CLOUDFLARE_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW,
    maxTokens: CLOUDFLARE_AI_GATEWAY_DEFAULT_MAX_TOKENS,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveCloudflareAiGatewayBaseUrl(params: {
  accountId: string;
  gatewayId: string;
}): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = params.accountId.trim();
  const gatewayId = params.gatewayId.trim();
  if (!accountId || !gatewayId) {
    return "";
  }
  return `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/anthropic`;
}
