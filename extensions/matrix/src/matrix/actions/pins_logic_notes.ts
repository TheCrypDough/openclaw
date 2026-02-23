/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/actions/pins.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveMatrixRoomId } from "../send.js";
import { resolveActionClient } from "./client.js";
import { fetchEventSummary, readPinnedEvents } from "./summary.js";
import {
  EventType,
  type MatrixActionClientOpts,
  type MatrixActionClient,
  type MatrixMessageSummary,
  type RoomPinnedEventsEventContent,
} from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ActionClient = MatrixActionClient["client"];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function withResolvedPinRoom<T>(
  roomId: string,
  opts: MatrixActionClientOpts,
  run: (client: ActionClient, resolvedRoom: string) => Promise<T>,
): Promise<T> {
  const { client, stopOnDone } = await resolveActionClient(opts);
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolvedRoom = await resolveMatrixRoomId(client, roomId);
    return await run(client, resolvedRoom);
  } finally {
    if (stopOnDone) {
      client.stop();
    }
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function updateMatrixPins(
  roomId: string,
  messageId: string,
  opts: MatrixActionClientOpts,
  update: (current: string[]) => string[],
): Promise<{ pinned: string[] }> {
  return await withResolvedPinRoom(roomId, opts, async (client, resolvedRoom) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const current = await readPinnedEvents(client, resolvedRoom);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const next = update(current);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const payload: RoomPinnedEventsEventContent = { pinned: next };
    await client.sendStateEvent(resolvedRoom, EventType.RoomPinnedEvents, "", payload);
    return { pinned: next };
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function pinMatrixMessage(
  roomId: string,
  messageId: string,
  opts: MatrixActionClientOpts = {},
): Promise<{ pinned: string[] }> {
  return await updateMatrixPins(roomId, messageId, opts, (current) =>
    current.includes(messageId) ? current : [...current, messageId],
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function unpinMatrixMessage(
  roomId: string,
  messageId: string,
  opts: MatrixActionClientOpts = {},
): Promise<{ pinned: string[] }> {
  return await updateMatrixPins(roomId, messageId, opts, (current) =>
    current.filter((id) => id !== messageId),
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function listMatrixPins(
  roomId: string,
  opts: MatrixActionClientOpts = {},
): Promise<{ pinned: string[]; events: MatrixMessageSummary[] }> {
  return await withResolvedPinRoom(roomId, opts, async (client, resolvedRoom) => {
    const pinned = await readPinnedEvents(client, resolvedRoom);
    const events = (
      await Promise.all(
        pinned.map(async (eventId) => {
          try {
            return await fetchEventSummary(client, resolvedRoom, eventId);
          } catch {
            return null;
          }
        }),
      )
    ).filter((event): event is MatrixMessageSummary => Boolean(event));
    return { pinned, events };
  });
}
