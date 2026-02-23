/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/targets.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type TlonTarget =
  | { kind: "direct"; ship: string }
  | { kind: "group"; nest: string; hostShip: string; channelName: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SHIP_RE = /^~?[a-z-]+$/i;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const NEST_RE = /^chat\/([^/]+)\/([^/]+)$/i;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeShip(raw: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return trimmed;
  }
  return trimmed.startsWith("~") ? trimmed : `~${trimmed}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseChannelNest(raw: string): { hostShip: string; channelName: string } | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = NEST_RE.exec(raw.trim());
  if (!match) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hostShip = normalizeShip(match[1]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const channelName = match[2];
  return { hostShip, channelName };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseTlonTarget(raw?: string | null): TlonTarget | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw?.trim();
  if (!trimmed) {
    return null;
  }
  const withoutPrefix = trimmed.replace(/^tlon:/i, "");

  const dmPrefix = withoutPrefix.match(/^dm[/:](.+)$/i);
  if (dmPrefix) {
    return { kind: "direct", ship: normalizeShip(dmPrefix[1]) };
  }

  const groupPrefix = withoutPrefix.match(/^(group|room)[/:](.+)$/i);
  if (groupPrefix) {
    const groupTarget = groupPrefix[2].trim();
    if (groupTarget.startsWith("chat/")) {
      const parsed = parseChannelNest(groupTarget);
      if (!parsed) {
        return null;
      }
      return {
        kind: "group",
        nest: `chat/${parsed.hostShip}/${parsed.channelName}`,
        hostShip: parsed.hostShip,
        channelName: parsed.channelName,
      };
    }
    const parts = groupTarget.split("/");
    if (parts.length === 2) {
      const hostShip = normalizeShip(parts[0]);
      const channelName = parts[1];
      return {
        kind: "group",
        nest: `chat/${hostShip}/${channelName}`,
        hostShip,
        channelName,
      };
    }
    return null;
  }

  if (withoutPrefix.startsWith("chat/")) {
    const parsed = parseChannelNest(withoutPrefix);
    if (!parsed) {
      return null;
    }
    return {
      kind: "group",
      nest: `chat/${parsed.hostShip}/${parsed.channelName}`,
      hostShip: parsed.hostShip,
      channelName: parsed.channelName,
    };
  }

  if (SHIP_RE.test(withoutPrefix)) {
    return { kind: "direct", ship: normalizeShip(withoutPrefix) };
  }

  return null;
}

export function formatTargetHint(): string {
  return "dm/~sampel-palnet | ~sampel-palnet | chat/~host-ship/channel | group:~host-ship/channel";
}
