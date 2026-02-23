/*
 * AUTO ANNOTATION
 * File: src/slack/modal-metadata.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type SlackModalPrivateMetadata = {
  sessionKey?: string;
  channelId?: string;
  channelType?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SLACK_PRIVATE_METADATA_MAX = 3000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSlackModalPrivateMetadata(raw: unknown): SlackModalPrivateMetadata {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return {};
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      sessionKey: normalizeString(parsed.sessionKey),
      channelId: normalizeString(parsed.channelId),
      channelType: normalizeString(parsed.channelType),
    };
  } catch {
    return {};
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function encodeSlackModalPrivateMetadata(input: SlackModalPrivateMetadata): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payload: SlackModalPrivateMetadata = {
    ...(input.sessionKey ? { sessionKey: input.sessionKey } : {}),
    ...(input.channelId ? { channelId: input.channelId } : {}),
    ...(input.channelType ? { channelType: input.channelType } : {}),
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const encoded = JSON.stringify(payload);
  if (encoded.length > SLACK_PRIVATE_METADATA_MAX) {
    throw new Error(
      `Slack modal private_metadata cannot exceed ${SLACK_PRIVATE_METADATA_MAX} chars`,
    );
  }
  return encoded;
}
