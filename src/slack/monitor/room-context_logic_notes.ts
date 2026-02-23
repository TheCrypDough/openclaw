/*
 * AUTO ANNOTATION
 * File: src/slack/monitor/room-context.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { buildUntrustedChannelMetadata } from "../../security/channel-metadata.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSlackRoomContextHints(params: {
  isRoomish: boolean;
  channelInfo?: { topic?: string; purpose?: string };
  channelConfig?: { systemPrompt?: string | null } | null;
}): {
  untrustedChannelMetadata?: ReturnType<typeof buildUntrustedChannelMetadata>;
  groupSystemPrompt?: string;
} {
  if (!params.isRoomish) {
    return {};
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const untrustedChannelMetadata = buildUntrustedChannelMetadata({
    source: "slack",
    label: "Slack channel description",
    entries: [params.channelInfo?.topic, params.channelInfo?.purpose],
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const systemPromptParts = [params.channelConfig?.systemPrompt?.trim() || null].filter(
    (entry): entry is string => Boolean(entry),
  );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const groupSystemPrompt =
    systemPromptParts.length > 0 ? systemPromptParts.join("\n\n") : undefined;

  return {
    untrustedChannelMetadata,
    groupSystemPrompt,
  };
}
