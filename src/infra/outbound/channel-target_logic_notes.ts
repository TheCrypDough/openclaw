/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/channel-target.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { MESSAGE_ACTION_TARGET_MODE } from "./message-action-spec.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CHANNEL_TARGET_DESCRIPTION =
  "Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack channel/user, or iMessage handle/chat_id";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CHANNEL_TARGETS_DESCRIPTION =
  "Recipient/channel targets (same format as --target); accepts ids or names when the directory is available.";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyTargetToParams(params: {
  action: string;
  args: Record<string, unknown>;
}): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const target = typeof params.args.target === "string" ? params.args.target.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasLegacyTo = typeof params.args.to === "string";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasLegacyChannelId = typeof params.args.channelId === "string";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mode =
    MESSAGE_ACTION_TARGET_MODE[params.action as keyof typeof MESSAGE_ACTION_TARGET_MODE] ?? "none";

  if (mode !== "none") {
    if (hasLegacyTo || hasLegacyChannelId) {
      throw new Error("Use `target` instead of `to`/`channelId`.");
    }
  } else if (hasLegacyTo) {
    throw new Error("Use `target` for actions that accept a destination.");
  }

  if (!target) {
    return;
  }
  if (mode === "channelId") {
    params.args.channelId = target;
    return;
  }
  if (mode === "to") {
    params.args.to = target;
    return;
  }
  throw new Error(`Action ${params.action} does not accept a target.`);
}
