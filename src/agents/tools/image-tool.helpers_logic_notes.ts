/*
 * AUTO ANNOTATION
 * File: src/agents/tools/image-tool.helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AssistantMessage } from "@mariozechner/pi-ai";
import type { OpenClawConfig } from "../../config/config.js";
import { extractAssistantText } from "../pi-embedded-utils.js";

export type ImageModelConfig = { primary?: string; fallbacks?: string[] };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function decodeDataUrl(dataUrl: string): {
  buffer: Buffer;
  mimeType: string;
  kind: "image";
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = dataUrl.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = /^data:([^;,]+);base64,([a-z0-9+/=\r\n]+)$/i.exec(trimmed);
  if (!match) {
    throw new Error("Invalid data URL (expected base64 data: URL).");
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mimeType = (match[1] ?? "").trim().toLowerCase();
  if (!mimeType.startsWith("image/")) {
    throw new Error(`Unsupported data URL type: ${mimeType || "unknown"}`);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const b64 = (match[2] ?? "").trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const buffer = Buffer.from(b64, "base64");
  if (buffer.length === 0) {
    throw new Error("Invalid data URL: empty payload.");
  }
  return { buffer, mimeType, kind: "image" };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function coerceImageAssistantText(params: {
  message: AssistantMessage;
  provider: string;
  model: string;
}): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stop = params.message.stopReason;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const errorMessage = params.message.errorMessage?.trim();
  if (stop === "error" || stop === "aborted") {
    throw new Error(
      errorMessage
        ? `Image model failed (${params.provider}/${params.model}): ${errorMessage}`
        : `Image model failed (${params.provider}/${params.model})`,
    );
  }
  if (errorMessage) {
    throw new Error(`Image model failed (${params.provider}/${params.model}): ${errorMessage}`);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const text = extractAssistantText(params.message);
  if (text.trim()) {
    return text.trim();
  }
  throw new Error(`Image model returned no text (${params.provider}/${params.model}).`);
}

export function coerceImageModelConfig(cfg?: OpenClawConfig): ImageModelConfig {
  const imageModel = cfg?.agents?.defaults?.imageModel as
    | { primary?: string; fallbacks?: string[] }
    | string
    | undefined;
  const primary = typeof imageModel === "string" ? imageModel.trim() : imageModel?.primary;
  const fallbacks = typeof imageModel === "object" ? (imageModel?.fallbacks ?? []) : [];
  return {
    ...(primary?.trim() ? { primary: primary.trim() } : {}),
    ...(fallbacks.length > 0 ? { fallbacks } : {}),
  };
}

export function resolveProviderVisionModelFromConfig(params: {
  cfg?: OpenClawConfig;
  provider: string;
}): string | null {
  const providerCfg = params.cfg?.models?.providers?.[params.provider] as unknown as
    | { models?: Array<{ id?: string; input?: string[] }> }
    | undefined;
  const models = providerCfg?.models ?? [];
  const preferMinimaxVl =
    params.provider === "minimax"
      ? models.find(
          (m) =>
            (m?.id ?? "").trim() === "MiniMax-VL-01" &&
            Array.isArray(m?.input) &&
            m.input.includes("image"),
        )
      : null;
  const picked =
    preferMinimaxVl ??
    models.find((m) => Boolean((m?.id ?? "").trim()) && m.input?.includes("image"));
  const id = (picked?.id ?? "").trim();
  return id ? `${params.provider}/${id}` : null;
}
