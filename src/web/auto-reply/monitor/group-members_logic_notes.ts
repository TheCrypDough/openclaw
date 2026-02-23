/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply/monitor/group-members.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeE164 } from "../../../utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function noteGroupMember(
  groupMemberNames: Map<string, Map<string, string>>,
  conversationId: string,
  e164?: string,
  name?: string,
) {
  if (!e164 || !name) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeE164(e164);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = normalized ?? e164;
  if (!key) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let roster = groupMemberNames.get(conversationId);
  if (!roster) {
    roster = new Map();
    groupMemberNames.set(conversationId, roster);
  }
  roster.set(key, name);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatGroupMembers(params: {
  participants: string[] | undefined;
  roster: Map<string, string> | undefined;
  fallbackE164?: string;
}) {
  const { participants, roster, fallbackE164 } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const seen = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ordered: string[] = [];
  if (participants?.length) {
    for (const entry of participants) {
      if (!entry) {
        continue;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const normalized = normalizeE164(entry) ?? entry;
      if (!normalized || seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      ordered.push(normalized);
    }
  }
  if (roster) {
    for (const entry of roster.keys()) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const normalized = normalizeE164(entry) ?? entry;
      if (!normalized || seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      ordered.push(normalized);
    }
  }
  if (ordered.length === 0 && fallbackE164) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalizeE164(fallbackE164) ?? fallbackE164;
    if (normalized) {
      ordered.push(normalized);
    }
  }
  if (ordered.length === 0) {
    return undefined;
  }
  return ordered
    .map((entry) => {
      const name = roster?.get(entry);
      return name ? `${name} (${entry})` : entry;
    })
    .join(", ");
}
