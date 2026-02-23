/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/monitor/room-info.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MatrixClient } from "@vector-im/matrix-bot-sdk";

export type MatrixRoomInfo = {
  name?: string;
  canonicalAlias?: string;
  altAliases: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createMatrixRoomInfoResolver(client: MatrixClient) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const roomInfoCache = new Map<string, MatrixRoomInfo>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const getRoomInfo = async (roomId: string): Promise<MatrixRoomInfo> => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cached = roomInfoCache.get(roomId);
    if (cached) {
      return cached;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let name: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let canonicalAlias: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let altAliases: string[] = [];
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const nameState = await client.getRoomStateEvent(roomId, "m.room.name", "").catch(() => null);
      name = nameState?.name;
    } catch {
      // ignore
    }
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const aliasState = await client
        .getRoomStateEvent(roomId, "m.room.canonical_alias", "")
        .catch(() => null);
      canonicalAlias = aliasState?.alias;
      altAliases = aliasState?.alt_aliases ?? [];
    } catch {
      // ignore
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const info = { name, canonicalAlias, altAliases };
    roomInfoCache.set(roomId, info);
    return info;
  };

  const getMemberDisplayName = async (roomId: string, userId: string): Promise<string> => {
    try {
      const memberState = await client
        .getRoomStateEvent(roomId, "m.room.member", userId)
        .catch(() => null);
      return memberState?.displayname ?? userId;
    } catch {
      return userId;
    }
  };

  return {
    getRoomInfo,
    getMemberDisplayName,
  };
}
