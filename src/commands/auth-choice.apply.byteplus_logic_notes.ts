/*
 * AUTO ANNOTATION
 * File: src/commands/auth-choice.apply.byteplus.ts
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

/** Default model for BytePlus auth onboarding. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BYTEPLUS_DEFAULT_MODEL = "byteplus-plan/ark-code-latest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function applyAuthChoiceBytePlus(
  params: ApplyAuthChoiceParams,
): Promise<ApplyAuthChoiceResult | null> {
  if (params.authChoice !== "byteplus-api-key") {
    return null;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const envKey = resolveEnvApiKey("byteplus");
  if (envKey) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const useExisting = await params.prompter.confirm({
      message: `Use existing BYTEPLUS_API_KEY (${envKey.source}, ${formatApiKeyPreview(envKey.apiKey)})?`,
      initialValue: true,
    });
    if (useExisting) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = upsertSharedEnvVar({
        key: "BYTEPLUS_API_KEY",
        value: envKey.apiKey,
      });
      if (!process.env.BYTEPLUS_API_KEY) {
        process.env.BYTEPLUS_API_KEY = envKey.apiKey;
      }
      await params.prompter.note(
        `Copied BYTEPLUS_API_KEY to ${result.path} for launchd compatibility.`,
        "BytePlus API key",
      );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const configWithModel = applyPrimaryModel(params.config, BYTEPLUS_DEFAULT_MODEL);
      return {
        config: configWithModel,
        agentModelOverride: BYTEPLUS_DEFAULT_MODEL,
      };
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let key: string | undefined;
  if (params.opts?.byteplusApiKey) {
    key = params.opts.byteplusApiKey;
  } else {
    key = await params.prompter.text({
      message: "Enter BytePlus API key",
      validate: validateApiKeyInput,
    });
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = normalizeApiKeyInput(String(key));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = upsertSharedEnvVar({
    key: "BYTEPLUS_API_KEY",
    value: trimmed,
  });
  process.env.BYTEPLUS_API_KEY = trimmed;
  await params.prompter.note(
    `Saved BYTEPLUS_API_KEY to ${result.path} for launchd compatibility.`,
    "BytePlus API key",
  );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configWithModel = applyPrimaryModel(params.config, BYTEPLUS_DEFAULT_MODEL);
  return {
    config: configWithModel,
    agentModelOverride: BYTEPLUS_DEFAULT_MODEL,
  };
}
