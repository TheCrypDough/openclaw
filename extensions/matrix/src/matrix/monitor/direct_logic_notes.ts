/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/monitor/direct.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MatrixClient } from "@vector-im/matrix-bot-sdk";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DirectMessageCheck = {
  roomId: string;
  senderId?: string;
  selfUserId?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DirectRoomTrackerOptions = {
  log?: (message: string) => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DM_CACHE_TTL_MS = 30_000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createDirectRoomTracker(client: MatrixClient, opts: DirectRoomTrackerOptions = {}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const log = opts.log ?? (() => {});
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let lastDmUpdateMs = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let cachedSelfUserId: string | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const memberCountCache = new Map<string, { count: number; ts: number }>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ensureSelfUserId = async (): Promise<string | null> => {
    if (cachedSelfUserId) {
      return cachedSelfUserId;
    }
    try {
      cachedSelfUserId = await client.getUserId();
    } catch {
      cachedSelfUserId = null;
    }
    return cachedSelfUserId;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const refreshDmCache = async (): Promise<void> => {
    const now = Date.now();
    if (now - lastDmUpdateMs < DM_CACHE_TTL_MS) {
      return;
    }
    lastDmUpdateMs = now;
    try {
      await client.dms.update();
    } catch (err) {
      log(`matrix: dm cache refresh failed (${String(err)})`);
    }
  };

  const resolveMemberCount = async (roomId: string): Promise<number | null> => {
    const cached = memberCountCache.get(roomId);
    const now = Date.now();
    if (cached && now - cached.ts < DM_CACHE_TTL_MS) {
      return cached.count;
    }
    try {
      const members = await client.getJoinedRoomMembers(roomId);
      const count = members.length;
      memberCountCache.set(roomId, { count, ts: now });
      return count;
    } catch (err) {
      log(`matrix: dm member count failed room=${roomId} (${String(err)})`);
      return null;
    }
  };

  const hasDirectFlag = async (roomId: string, userId?: string): Promise<boolean> => {
    const target = userId?.trim();
    if (!target) {
      return false;
    }
    try {
      const state = await client.getRoomStateEvent(roomId, "m.room.member", target);
      return state?.is_direct === true;
    } catch {
      return false;
    }
  };

  return {
    isDirectMessage: async (params: DirectMessageCheck): Promise<boolean> => {
      const { roomId, senderId } = params;
      await refreshDmCache();

      if (client.dms.isDm(roomId)) {
        log(`matrix: dm detected via m.direct room=${roomId}`);
        return true;
      }

      const memberCount = await resolveMemberCount(roomId);
      if (memberCount === 2) {
        log(`matrix: dm detected via member count room=${roomId} members=${memberCount}`);
        return true;
      }

      const selfUserId = params.selfUserId ?? (await ensureSelfUserId());
      const directViaState =
        (await hasDirectFlag(roomId, senderId)) || (await hasDirectFlag(roomId, selfUserId ?? ""));
      if (directViaState) {
        log(`matrix: dm detected via member state room=${roomId}`);
        return true;
      }

      log(`matrix: dm check room=${roomId} result=group members=${memberCount ?? "unknown"}`);
      return false;
    },
  };
}
