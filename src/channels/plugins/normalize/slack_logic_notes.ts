/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/normalize/slack.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { parseSlackTarget } from "../../../slack/targets.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeSlackMessagingTarget(raw: string): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const target = parseSlackTarget(raw, { defaultKind: "channel" });
  return target?.normalized;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function looksLikeSlackTargetId(raw: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return false;
  }
  if (/^<@([A-Z0-9]+)>$/i.test(trimmed)) {
    return true;
  }
  if (/^(user|channel):/i.test(trimmed)) {
    return true;
  }
  if (/^slack:/i.test(trimmed)) {
    return true;
  }
  if (/^[@#]/.test(trimmed)) {
    return true;
  }
  return /^[CUWGD][A-Z0-9]{8,}$/i.test(trimmed);
}
