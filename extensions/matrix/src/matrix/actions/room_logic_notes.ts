/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/actions/room.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveMatrixRoomId } from "../send.js";
import { resolveActionClient } from "./client.js";
import { EventType, type MatrixActionClientOpts } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function getMatrixMemberInfo(
  userId: string,
  opts: MatrixActionClientOpts & { roomId?: string } = {},
) {
  const { client, stopOnDone } = await resolveActionClient(opts);
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const roomId = opts.roomId ? await resolveMatrixRoomId(client, opts.roomId) : undefined;
    // @vector-im/matrix-bot-sdk uses getUserProfile
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const profile = await client.getUserProfile(userId);
    // Note: @vector-im/matrix-bot-sdk doesn't have getRoom().getMember() like matrix-js-sdk
    // We'd need to fetch room state separately if needed
    return {
      userId,
      profile: {
        displayName: profile?.displayname ?? null,
        avatarUrl: profile?.avatar_url ?? null,
      },
      membership: null, // Would need separate room state query
      powerLevel: null, // Would need separate power levels state query
      displayName: profile?.displayname ?? null,
      roomId: roomId ?? null,
    };
  } finally {
    if (stopOnDone) {
      client.stop();
    }
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function getMatrixRoomInfo(roomId: string, opts: MatrixActionClientOpts = {}) {
  const { client, stopOnDone } = await resolveActionClient(opts);
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolvedRoom = await resolveMatrixRoomId(client, roomId);
    // @vector-im/matrix-bot-sdk uses getRoomState for state events
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let name: string | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let topic: string | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let canonicalAlias: string | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let memberCount: number | null = null;

    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const nameState = await client.getRoomStateEvent(resolvedRoom, "m.room.name", "");
      name = nameState?.name ?? null;
    } catch {
      // ignore
    }

    try {
      const topicState = await client.getRoomStateEvent(resolvedRoom, EventType.RoomTopic, "");
      topic = topicState?.topic ?? null;
    } catch {
      // ignore
    }

    try {
      const aliasState = await client.getRoomStateEvent(resolvedRoom, "m.room.canonical_alias", "");
      canonicalAlias = aliasState?.alias ?? null;
    } catch {
      // ignore
    }

    try {
      const members = await client.getJoinedRoomMembers(resolvedRoom);
      memberCount = members.length;
    } catch {
      // ignore
    }

    return {
      roomId: resolvedRoom,
      name,
      topic,
      canonicalAlias,
      altAliases: [], // Would need separate query
      memberCount,
    };
  } finally {
    if (stopOnDone) {
      client.stop();
    }
  }
}
