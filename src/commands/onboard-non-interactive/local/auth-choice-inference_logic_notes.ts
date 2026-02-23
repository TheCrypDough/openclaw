/*
 * AUTO ANNOTATION
 * File: src/commands/onboard-non-interactive/local/auth-choice-inference.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { ONBOARD_PROVIDER_AUTH_FLAGS } from "../../onboard-provider-auth-flags.js";
import type { AuthChoice, OnboardOptions } from "../../onboard-types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AuthChoiceFlag = {
  optionKey: keyof AuthChoiceFlagOptions;
  authChoice: AuthChoice;
  label: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AuthChoiceFlagOptions = Pick<
  OnboardOptions,
  | "anthropicApiKey"
  | "geminiApiKey"
  | "openaiApiKey"
  | "openrouterApiKey"
  | "aiGatewayApiKey"
  | "cloudflareAiGatewayApiKey"
  | "moonshotApiKey"
  | "kimiCodeApiKey"
  | "syntheticApiKey"
  | "veniceApiKey"
  | "togetherApiKey"
  | "huggingfaceApiKey"
  | "zaiApiKey"
  | "xiaomiApiKey"
  | "minimaxApiKey"
  | "opencodeZenApiKey"
  | "xaiApiKey"
  | "litellmApiKey"
  | "qianfanApiKey"
  | "volcengineApiKey"
  | "byteplusApiKey"
  | "customBaseUrl"
  | "customModelId"
  | "customApiKey"
>;

export type AuthChoiceInference = {
  choice?: AuthChoice;
  matches: AuthChoiceFlag[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function hasStringValue(value: unknown): boolean {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

// Infer auth choice from explicit provider API key flags.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function inferAuthChoiceFromFlags(opts: OnboardOptions): AuthChoiceInference {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matches: AuthChoiceFlag[] = ONBOARD_PROVIDER_AUTH_FLAGS.filter(({ optionKey }) =>
    hasStringValue(opts[optionKey]),
  ).map((flag) => ({
    optionKey: flag.optionKey,
    authChoice: flag.authChoice,
    label: flag.cliFlag,
  }));

  if (
    hasStringValue(opts.customBaseUrl) ||
    hasStringValue(opts.customModelId) ||
    hasStringValue(opts.customApiKey)
  ) {
    matches.push({
      optionKey: "customBaseUrl",
      authChoice: "custom-api-key",
      label: "--custom-base-url/--custom-model-id/--custom-api-key",
    });
  }

  return {
    choice: matches[0]?.authChoice,
    matches,
  };
}
