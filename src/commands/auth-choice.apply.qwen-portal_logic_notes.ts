/*
 * AUTO ANNOTATION
 * File: src/commands/auth-choice.apply.qwen-portal.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ApplyAuthChoiceParams, ApplyAuthChoiceResult } from "./auth-choice.apply.js";
import { applyAuthChoicePluginProvider } from "./auth-choice.apply.plugin-provider.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function applyAuthChoiceQwenPortal(
  params: ApplyAuthChoiceParams,
): Promise<ApplyAuthChoiceResult | null> {
  return await applyAuthChoicePluginProvider(params, {
    authChoice: "qwen-portal",
    pluginId: "qwen-portal-auth",
    providerId: "qwen-portal",
    methodId: "device",
    label: "Qwen",
  });
}
