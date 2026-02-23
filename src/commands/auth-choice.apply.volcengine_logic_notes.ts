/*
 * AUTO ANNOTATION
 * File: src/commands/auth-choice.apply.volcengine.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveEnvApiKey } from "../agents/model-auth.js";
import { upsertSharedEnvVar } from "../infra/env-file.js";
import {
  formatApiKeyPreview,
  normalizeApiKeyInput,
  validateApiKeyInput,
} from "./auth-choice.api-key.js";
import type { ApplyAuthChoiceParams, ApplyAuthChoiceResult } from "./auth-choice.apply.js";
import { applyPrimaryModel } from "./model-picker.js";

/** Default model for Volcano Engine auth onboarding. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const VOLCENGINE_DEFAULT_MODEL = "volcengine-plan/ark-code-latest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function applyAuthChoiceVolcengine(
  params: ApplyAuthChoiceParams,
): Promise<ApplyAuthChoiceResult | null> {
  if (params.authChoice !== "volcengine-api-key") {
    return null;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const envKey = resolveEnvApiKey("volcengine");
  if (envKey) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const useExisting = await params.prompter.confirm({
      message: `Use existing VOLCANO_ENGINE_API_KEY (${envKey.source}, ${formatApiKeyPreview(envKey.apiKey)})?`,
      initialValue: true,
    });
    if (useExisting) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = upsertSharedEnvVar({
        key: "VOLCANO_ENGINE_API_KEY",
        value: envKey.apiKey,
      });
      if (!process.env.VOLCANO_ENGINE_API_KEY) {
        process.env.VOLCANO_ENGINE_API_KEY = envKey.apiKey;
      }
      await params.prompter.note(
        `Copied VOLCANO_ENGINE_API_KEY to ${result.path} for launchd compatibility.`,
        "Volcano Engine API Key",
      );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const configWithModel = applyPrimaryModel(params.config, VOLCENGINE_DEFAULT_MODEL);
      return {
        config: configWithModel,
        agentModelOverride: VOLCENGINE_DEFAULT_MODEL,
      };
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let key: string | undefined;
  if (params.opts?.volcengineApiKey) {
    key = params.opts.volcengineApiKey;
  } else {
    key = await params.prompter.text({
      message: "Enter Volcano Engine API Key",
      validate: validateApiKeyInput,
    });
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = normalizeApiKeyInput(String(key));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = upsertSharedEnvVar({
    key: "VOLCANO_ENGINE_API_KEY",
    value: trimmed,
  });
  process.env.VOLCANO_ENGINE_API_KEY = trimmed;
  await params.prompter.note(
    `Saved VOLCANO_ENGINE_API_KEY to ${result.path} for launchd compatibility.`,
    "Volcano Engine API Key",
  );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configWithModel = applyPrimaryModel(params.config, VOLCENGINE_DEFAULT_MODEL);
  return {
    config: configWithModel,
    agentModelOverride: VOLCENGINE_DEFAULT_MODEL,
  };
}
