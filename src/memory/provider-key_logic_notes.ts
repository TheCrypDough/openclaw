/*
 * AUTO ANNOTATION
 * File: src/memory/provider-key.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { fingerprintHeaderNames } from "./headers-fingerprint.js";
import { hashText } from "./internal.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function computeEmbeddingProviderKey(params: {
  providerId: string;
  providerModel: string;
  openAi?: { baseUrl: string; model: string; headers: Record<string, string> };
  gemini?: { baseUrl: string; model: string; headers: Record<string, string> };
}): string {
  if (params.openAi) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const headerNames = fingerprintHeaderNames(params.openAi.headers);
    return hashText(
      JSON.stringify({
        provider: "openai",
        baseUrl: params.openAi.baseUrl,
        model: params.openAi.model,
        headerNames,
      }),
    );
  }
  if (params.gemini) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const headerNames = fingerprintHeaderNames(params.gemini.headers);
    return hashText(
      JSON.stringify({
        provider: "gemini",
        baseUrl: params.gemini.baseUrl,
        model: params.gemini.model,
        headerNames,
      }),
    );
  }
  return hashText(JSON.stringify({ provider: params.providerId, model: params.providerModel }));
}
