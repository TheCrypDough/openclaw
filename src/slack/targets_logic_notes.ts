/*
 * AUTO ANNOTATION
 * File: src/slack/targets.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  buildMessagingTarget,
  ensureTargetId,
  parseTargetMention,
  parseTargetPrefixes,
  requireTargetKind,
  type MessagingTarget,
  type MessagingTargetKind,
  type MessagingTargetParseOptions,
} from "../channels/targets.js";

export type SlackTargetKind = MessagingTargetKind;

export type SlackTarget = MessagingTarget;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SlackTargetParseOptions = MessagingTargetParseOptions;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSlackTarget(
  raw: string,
  options: SlackTargetParseOptions = {},
): SlackTarget | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mentionTarget = parseTargetMention({
    raw: trimmed,
    mentionPattern: /^<@([A-Z0-9]+)>$/i,
    kind: "user",
  });
  if (mentionTarget) {
    return mentionTarget;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prefixedTarget = parseTargetPrefixes({
    raw: trimmed,
    prefixes: [
      { prefix: "user:", kind: "user" },
      { prefix: "channel:", kind: "channel" },
      { prefix: "slack:", kind: "user" },
    ],
  });
  if (prefixedTarget) {
    return prefixedTarget;
  }
  if (trimmed.startsWith("@")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const candidate = trimmed.slice(1).trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = ensureTargetId({
      candidate,
      pattern: /^[A-Z0-9]+$/i,
      errorMessage: "Slack DMs require a user id (use user:<id> or <@id>)",
    });
    return buildMessagingTarget("user", id, trimmed);
  }
  if (trimmed.startsWith("#")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const candidate = trimmed.slice(1).trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const id = ensureTargetId({
      candidate,
      pattern: /^[A-Z0-9]+$/i,
      errorMessage: "Slack channels require a channel id (use channel:<id>)",
    });
    return buildMessagingTarget("channel", id, trimmed);
  }
  if (options.defaultKind) {
    return buildMessagingTarget(options.defaultKind, trimmed, trimmed);
  }
  return buildMessagingTarget("channel", trimmed, trimmed);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSlackChannelId(raw: string): string {
  const target = parseSlackTarget(raw, { defaultKind: "channel" });
  return requireTargetKind({ platform: "Slack", target, kind: "channel" });
}
