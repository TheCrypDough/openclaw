/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/actions/reactions.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveMatrixRoomId } from "../send.js";
import { resolveActionClient } from "./client.js";
import { resolveMatrixActionLimit } from "./limits.js";
import {
  EventType,
  RelationType,
  type MatrixActionClientOpts,
  type MatrixRawEvent,
  type MatrixReactionSummary,
  type ReactionEventContent,
} from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function getReactionsPath(roomId: string, messageId: string): string {
  return `/_matrix/client/v1/rooms/${encodeURIComponent(roomId)}/relations/${encodeURIComponent(messageId)}/${RelationType.Annotation}/${EventType.Reaction}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function listReactionEvents(
  client: NonNullable<MatrixActionClientOpts["client"]>,
  roomId: string,
  messageId: string,
  limit: number,
): Promise<MatrixRawEvent[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = (await client.doRequest("GET", getReactionsPath(roomId, messageId), {
    dir: "b",
    limit,
  })) as { chunk: MatrixRawEvent[] };
  return res.chunk;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function listMatrixReactions(
  roomId: string,
  messageId: string,
  opts: MatrixActionClientOpts & { limit?: number } = {},
): Promise<MatrixReactionSummary[]> {
  const { client, stopOnDone } = await resolveActionClient(opts);
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolvedRoom = await resolveMatrixRoomId(client, roomId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const limit = resolveMatrixActionLimit(opts.limit, 100);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const chunk = await listReactionEvents(client, resolvedRoom, messageId, limit);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const summaries = new Map<string, MatrixReactionSummary>();
    for (const event of chunk) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const content = event.content as ReactionEventContent;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const key = content["m.relates_to"]?.key;
      if (!key) {
        continue;
      }
      const sender = event.sender ?? "";
      const entry: MatrixReactionSummary = summaries.get(key) ?? {
        key,
        count: 0,
        users: [],
      };
      entry.count += 1;
      if (sender && !entry.users.includes(sender)) {
        entry.users.push(sender);
      }
      summaries.set(key, entry);
    }
    return Array.from(summaries.values());
  } finally {
    if (stopOnDone) {
      client.stop();
    }
  }
}

export async function removeMatrixReactions(
  roomId: string,
  messageId: string,
  opts: MatrixActionClientOpts & { emoji?: string } = {},
): Promise<{ removed: number }> {
  const { client, stopOnDone } = await resolveActionClient(opts);
  try {
    const resolvedRoom = await resolveMatrixRoomId(client, roomId);
    const chunk = await listReactionEvents(client, resolvedRoom, messageId, 200);
    const userId = await client.getUserId();
    if (!userId) {
      return { removed: 0 };
    }
    const targetEmoji = opts.emoji?.trim();
    const toRemove = chunk
      .filter((event) => event.sender === userId)
      .filter((event) => {
        if (!targetEmoji) {
          return true;
        }
        const content = event.content as ReactionEventContent;
        return content["m.relates_to"]?.key === targetEmoji;
      })
      .map((event) => event.event_id)
      .filter((id): id is string => Boolean(id));
    if (toRemove.length === 0) {
      return { removed: 0 };
    }
    await Promise.all(toRemove.map((id) => client.redactEvent(resolvedRoom, id)));
    return { removed: toRemove.length };
  } finally {
    if (stopOnDone) {
      client.stop();
    }
  }
}
