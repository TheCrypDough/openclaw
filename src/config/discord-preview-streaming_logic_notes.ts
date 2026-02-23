/*
 * AUTO ANNOTATION
 * File: src/config/discord-preview-streaming.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type StreamingMode = "off" | "partial" | "block" | "progress";
export type DiscordPreviewStreamMode = "off" | "partial" | "block";
export type TelegramPreviewStreamMode = "off" | "partial" | "block";
export type SlackLegacyDraftStreamMode = "replace" | "status_final" | "append";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeStreamingMode(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = value.trim().toLowerCase();
  return normalized || null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseStreamingMode(value: unknown): StreamingMode | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeStreamingMode(value);
  if (
    normalized === "off" ||
    normalized === "partial" ||
    normalized === "block" ||
    normalized === "progress"
  ) {
    return normalized;
  }
  return null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseDiscordPreviewStreamMode(value: unknown): DiscordPreviewStreamMode | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = parseStreamingMode(value);
  if (!parsed) {
    return null;
  }
  return parsed === "progress" ? "partial" : parsed;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSlackLegacyDraftStreamMode(value: unknown): SlackLegacyDraftStreamMode | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeStreamingMode(value);
  if (normalized === "replace" || normalized === "status_final" || normalized === "append") {
    return normalized;
  }
  return null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function mapSlackLegacyDraftStreamModeToStreaming(
  mode: SlackLegacyDraftStreamMode,
): StreamingMode {
  if (mode === "append") {
    return "block";
  }
  if (mode === "status_final") {
    return "progress";
  }
  return "partial";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function mapStreamingModeToSlackLegacyDraftStreamMode(mode: StreamingMode) {
  if (mode === "block") {
    return "append" as const;
  }
  if (mode === "progress") {
    return "status_final" as const;
  }
  return "replace" as const;
}

export function resolveTelegramPreviewStreamMode(
  params: {
    streamMode?: unknown;
    streaming?: unknown;
  } = {},
): TelegramPreviewStreamMode {
  const parsedStreaming = parseStreamingMode(params.streaming);
  if (parsedStreaming) {
    if (parsedStreaming === "progress") {
      return "partial";
    }
    return parsedStreaming;
  }

  const legacy = parseDiscordPreviewStreamMode(params.streamMode);
  if (legacy) {
    return legacy;
  }
  if (typeof params.streaming === "boolean") {
    return params.streaming ? "partial" : "off";
  }
  return "off";
}

export function resolveDiscordPreviewStreamMode(
  params: {
    streamMode?: unknown;
    streaming?: unknown;
  } = {},
): DiscordPreviewStreamMode {
  const parsedStreaming = parseDiscordPreviewStreamMode(params.streaming);
  if (parsedStreaming) {
    return parsedStreaming;
  }

  const legacy = parseDiscordPreviewStreamMode(params.streamMode);
  if (legacy) {
    return legacy;
  }
  if (typeof params.streaming === "boolean") {
    return params.streaming ? "partial" : "off";
  }
  return "off";
}

export function resolveSlackStreamingMode(
  params: {
    streamMode?: unknown;
    streaming?: unknown;
  } = {},
): StreamingMode {
  const parsedStreaming = parseStreamingMode(params.streaming);
  if (parsedStreaming) {
    return parsedStreaming;
  }
  const legacyStreamMode = parseSlackLegacyDraftStreamMode(params.streamMode);
  if (legacyStreamMode) {
    return mapSlackLegacyDraftStreamModeToStreaming(legacyStreamMode);
  }
  // Legacy `streaming` was a Slack native-streaming toggle; preview mode stayed replace.
  if (typeof params.streaming === "boolean") {
    return "partial";
  }
  return "partial";
}

export function resolveSlackNativeStreaming(
  params: {
    nativeStreaming?: unknown;
    streaming?: unknown;
  } = {},
): boolean {
  if (typeof params.nativeStreaming === "boolean") {
    return params.nativeStreaming;
  }
  if (typeof params.streaming === "boolean") {
    return params.streaming;
  }
  return true;
}
