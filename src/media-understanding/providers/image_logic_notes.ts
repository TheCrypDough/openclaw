/*
 * AUTO ANNOTATION
 * File: src/media-understanding/providers/image.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Api, Context, Model } from "@mariozechner/pi-ai";
import { complete } from "@mariozechner/pi-ai";
import { minimaxUnderstandImage } from "../../agents/minimax-vlm.js";
import { getApiKeyForModel, requireApiKey } from "../../agents/model-auth.js";
import { ensureOpenClawModelsJson } from "../../agents/models-config.js";
import { discoverAuthStorage, discoverModels } from "../../agents/pi-model-discovery.js";
import { coerceImageAssistantText } from "../../agents/tools/image-tool.helpers.js";
import type { ImageDescriptionRequest, ImageDescriptionResult } from "../types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function describeImageWithModel(
  params: ImageDescriptionRequest,
): Promise<ImageDescriptionResult> {
  await ensureOpenClawModelsJson(params.cfg, params.agentDir);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const authStorage = discoverAuthStorage(params.agentDir);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const modelRegistry = discoverModels(authStorage, params.agentDir);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const model = modelRegistry.find(params.provider, params.model) as Model<Api> | null;
  if (!model) {
    throw new Error(`Unknown model: ${params.provider}/${params.model}`);
  }
  if (!model.input?.includes("image")) {
    throw new Error(`Model does not support images: ${params.provider}/${params.model}`);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const apiKeyInfo = await getApiKeyForModel({
    model,
    cfg: params.cfg,
    agentDir: params.agentDir,
    profileId: params.profile,
    preferredProfile: params.preferredProfile,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const apiKey = requireApiKey(apiKeyInfo, model.provider);
  authStorage.setRuntimeApiKey(model.provider, apiKey);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base64 = params.buffer.toString("base64");
  if (model.provider === "minimax") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = await minimaxUnderstandImage({
      apiKey,
      prompt: params.prompt ?? "Describe the image.",
      imageDataUrl: `data:${params.mime ?? "image/jpeg"};base64,${base64}`,
      modelBaseUrl: model.baseUrl,
    });
    return { text, model: model.id };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const context: Context = {
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: params.prompt ?? "Describe the image." },
          { type: "image", data: base64, mimeType: params.mime ?? "image/jpeg" },
        ],
        timestamp: Date.now(),
      },
    ],
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const message = await complete(model, context, {
    apiKey,
    maxTokens: params.maxTokens ?? 512,
  });
  const text = coerceImageAssistantText({
    message,
    provider: model.provider,
    model: model.id,
  });
  return { text, model: model.id };
}
