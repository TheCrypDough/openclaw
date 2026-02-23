/*
 * AUTO ANNOTATION
 * File: src/agents/model-compat.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Api, Model } from "@mariozechner/pi-ai";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isOpenAiCompletionsModel(model: Model<Api>): model is Model<"openai-completions"> {
  return model.api === "openai-completions";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeModelCompat(model: Model<Api>): Model<Api> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseUrl = model.baseUrl ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isZai = model.provider === "zai" || baseUrl.includes("api.z.ai");
  if (!isZai || !isOpenAiCompletionsModel(model)) {
    return model;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const openaiModel = model;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const compat = openaiModel.compat ?? undefined;
  if (compat?.supportsDeveloperRole === false) {
    return model;
  }

  openaiModel.compat = compat
    ? { ...compat, supportsDeveloperRole: false }
    : { supportsDeveloperRole: false };
  return openaiModel;
}
