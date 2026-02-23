/*
 * AUTO ANNOTATION
 * File: src/signal/monitor/mentions.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { SignalMention } from "./event-handler.types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OBJECT_REPLACEMENT = "\uFFFC";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isValidMention(mention: SignalMention | null | undefined): mention is SignalMention {
  if (!mention) {
    return false;
  }
  if (!(mention.uuid || mention.number)) {
    return false;
  }
  if (typeof mention.start !== "number" || Number.isNaN(mention.start)) {
    return false;
  }
  if (typeof mention.length !== "number" || Number.isNaN(mention.length)) {
    return false;
  }
  return mention.length > 0;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function clampBounds(start: number, length: number, textLength: number) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const safeStart = Math.max(0, Math.trunc(start));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const safeLength = Math.max(0, Math.trunc(length));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const safeEnd = Math.min(textLength, safeStart + safeLength);
  return { start: safeStart, end: safeEnd };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function renderSignalMentions(message: string, mentions?: SignalMention[] | null) {
  if (!message || !mentions?.length) {
    return message;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let normalized = message;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidates = mentions.filter(isValidMention).toSorted((a, b) => b.start! - a.start!);

  for (const mention of candidates) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const identifier = mention.uuid ?? mention.number;
    if (!identifier) {
      continue;
    }

    const { start, end } = clampBounds(mention.start!, mention.length!, normalized.length);
    if (start >= end) {
      continue;
    }
    const slice = normalized.slice(start, end);

    if (!slice.includes(OBJECT_REPLACEMENT)) {
      continue;
    }

    normalized = normalized.slice(0, start) + `@${identifier}` + normalized.slice(end);
  }

  return normalized;
}
