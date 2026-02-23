/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/monitor/rooms.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { buildChannelKeyCandidates, resolveChannelEntryMatch } from "openclaw/plugin-sdk";
import type { MatrixRoomConfig } from "../../types.js";

export type MatrixRoomConfigResolved = {
  allowed: boolean;
  allowlistConfigured: boolean;
  config?: MatrixRoomConfig;
  matchKey?: string;
  matchSource?: "direct" | "wildcard";
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveMatrixRoomConfig(params: {
  rooms?: Record<string, MatrixRoomConfig>;
  roomId: string;
  aliases: string[];
  name?: string | null;
}): MatrixRoomConfigResolved {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rooms = params.rooms ?? {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const keys = Object.keys(rooms);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowlistConfigured = keys.length > 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidates = buildChannelKeyCandidates(
    params.roomId,
    `room:${params.roomId}`,
    ...params.aliases,
  );
  const {
    entry: matched,
    key: matchedKey,
    wildcardEntry,
    wildcardKey,
  } = resolveChannelEntryMatch({
    entries: rooms,
    keys: candidates,
    wildcardKey: "*",
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved = matched ?? wildcardEntry;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowed = resolved ? resolved.enabled !== false && resolved.allow !== false : false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matchKey = matchedKey ?? wildcardKey;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const matchSource = matched ? "direct" : wildcardEntry ? "wildcard" : undefined;
  return {
    allowed,
    allowlistConfigured,
    config: resolved,
    matchKey,
    matchSource,
  };
}
