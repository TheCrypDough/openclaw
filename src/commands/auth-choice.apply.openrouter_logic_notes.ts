/*
 * AUTO ANNOTATION
 * File: src/commands/auth-choice.apply.openrouter.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { ensureAuthProfileStore, resolveAuthProfileOrder } from "../agents/auth-profiles.js";
import { resolveEnvApiKey } from "../agents/model-auth.js";
import {
  formatApiKeyPreview,
  normalizeApiKeyInput,
  validateApiKeyInput,
} from "./auth-choice.api-key.js";
import { createAuthChoiceAgentModelNoter } from "./auth-choice.apply-helpers.js";
import type { ApplyAuthChoiceParams, ApplyAuthChoiceResult } from "./auth-choice.apply.js";
import { applyDefaultModelChoice } from "./auth-choice.default-model.js";
import {
  applyAuthProfileConfig,
  applyOpenrouterConfig,
  applyOpenrouterProviderConfig,
  setOpenrouterApiKey,
  OPENROUTER_DEFAULT_MODEL_REF,
} from "./onboard-auth.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function applyAuthChoiceOpenRouter(
  params: ApplyAuthChoiceParams,
): Promise<ApplyAuthChoiceResult> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let nextConfig = params.config;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let agentModelOverride: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const noteAgentModel = createAuthChoiceAgentModelNoter(params);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const store = ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const profileOrder = resolveAuthProfileOrder({
    cfg: nextConfig,
    store,
    provider: "openrouter",
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existingProfileId = profileOrder.find((profileId) => Boolean(store.profiles[profileId]));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existingCred = existingProfileId ? store.profiles[existingProfileId] : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let profileId = "openrouter:default";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let mode: "api_key" | "oauth" | "token" = "api_key";
  let hasCredential = false;

  if (existingProfileId && existingCred?.type) {
    profileId = existingProfileId;
    mode =
      existingCred.type === "oauth" ? "oauth" : existingCred.type === "token" ? "token" : "api_key";
    hasCredential = true;
  }

  if (!hasCredential && params.opts?.token && params.opts?.tokenProvider === "openrouter") {
    await setOpenrouterApiKey(normalizeApiKeyInput(params.opts.token), params.agentDir);
    hasCredential = true;
  }

  if (!hasCredential) {
    const envKey = resolveEnvApiKey("openrouter");
    if (envKey) {
      const useExisting = await params.prompter.confirm({
        message: `Use existing OPENROUTER_API_KEY (${envKey.source}, ${formatApiKeyPreview(envKey.apiKey)})?`,
        initialValue: true,
      });
      if (useExisting) {
        await setOpenrouterApiKey(envKey.apiKey, params.agentDir);
        hasCredential = true;
      }
    }
  }

  if (!hasCredential) {
    const key = await params.prompter.text({
      message: "Enter OpenRouter API key",
      validate: validateApiKeyInput,
    });
    await setOpenrouterApiKey(normalizeApiKeyInput(String(key ?? "")), params.agentDir);
    hasCredential = true;
  }

  if (hasCredential) {
    nextConfig = applyAuthProfileConfig(nextConfig, {
      profileId,
      provider: "openrouter",
      mode,
    });
  }

  const applied = await applyDefaultModelChoice({
    config: nextConfig,
    setDefaultModel: params.setDefaultModel,
    defaultModel: OPENROUTER_DEFAULT_MODEL_REF,
    applyDefaultConfig: applyOpenrouterConfig,
    applyProviderConfig: applyOpenrouterProviderConfig,
    noteDefault: OPENROUTER_DEFAULT_MODEL_REF,
    noteAgentModel,
    prompter: params.prompter,
  });
  nextConfig = applied.config;
  agentModelOverride = applied.agentModelOverride ?? agentModelOverride;

  return { config: nextConfig, agentModelOverride };
}
