/*
 * AUTO ANNOTATION
 * File: src/slack/stream-mode.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  mapStreamingModeToSlackLegacyDraftStreamMode,
  resolveSlackNativeStreaming,
  resolveSlackStreamingMode,
  type SlackLegacyDraftStreamMode,
  type StreamingMode,
} from "../config/discord-preview-streaming.js";

export type SlackStreamMode = SlackLegacyDraftStreamMode;
export type SlackStreamingMode = StreamingMode;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_STREAM_MODE: SlackStreamMode = "replace";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSlackStreamMode(raw: unknown): SlackStreamMode {
  if (typeof raw !== "string") {
    return DEFAULT_STREAM_MODE;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = raw.trim().toLowerCase();
  if (normalized === "replace" || normalized === "status_final" || normalized === "append") {
    return normalized;
  }
  return DEFAULT_STREAM_MODE;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSlackStreamingConfig(params: {
  streaming?: unknown;
  streamMode?: unknown;
  nativeStreaming?: unknown;
}): { mode: SlackStreamingMode; nativeStreaming: boolean; draftMode: SlackStreamMode } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mode = resolveSlackStreamingMode(params);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const nativeStreaming = resolveSlackNativeStreaming(params);
  return {
    mode,
    nativeStreaming,
    draftMode: mapStreamingModeToSlackLegacyDraftStreamMode(mode),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyAppendOnlyStreamUpdate(params: {
  incoming: string;
  rendered: string;
  source: string;
}): { rendered: string; source: string; changed: boolean } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const incoming = params.incoming.trimEnd();
  if (!incoming) {
    return { rendered: params.rendered, source: params.source, changed: false };
  }
  if (!params.rendered) {
    return { rendered: incoming, source: incoming, changed: true };
  }
  if (incoming === params.source) {
    return { rendered: params.rendered, source: params.source, changed: false };
  }

  // Typical model partials are cumulative prefixes.
  if (incoming.startsWith(params.source) || incoming.startsWith(params.rendered)) {
    return { rendered: incoming, source: incoming, changed: incoming !== params.rendered };
  }

  // Ignore regressive shorter variants of the same stream.
  if (params.source.startsWith(incoming)) {
    return { rendered: params.rendered, source: params.source, changed: false };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const separator = params.rendered.endsWith("\n") ? "" : "\n";
  return {
    rendered: `${params.rendered}${separator}${incoming}`,
    source: incoming,
    changed: true,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildStatusFinalPreviewText(updateCount: number): string {
  const dots = ".".repeat((Math.max(1, updateCount) % 3) + 1);
  return `Status: thinking${dots}`;
}
