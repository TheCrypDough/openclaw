/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/actions/types.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MatrixClient } from "@vector-im/matrix-bot-sdk";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const MsgType = {
  Text: "m.text",
} as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const RelationType = {
  Replace: "m.replace",
  Annotation: "m.annotation",
} as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const EventType = {
  RoomMessage: "m.room.message",
  RoomPinnedEvents: "m.room.pinned_events",
  RoomTopic: "m.room.topic",
  Reaction: "m.reaction",
} as const;

export type RoomMessageEventContent = {
  msgtype: string;
  body: string;
  "m.new_content"?: RoomMessageEventContent;
  "m.relates_to"?: {
    rel_type?: string;
    event_id?: string;
    "m.in_reply_to"?: { event_id?: string };
  };
};

export type ReactionEventContent = {
  "m.relates_to": {
    rel_type: string;
    event_id: string;
    key: string;
  };
};

export type RoomPinnedEventsEventContent = {
  pinned: string[];
};

export type RoomTopicEventContent = {
  topic?: string;
};

export type MatrixRawEvent = {
  event_id: string;
  sender: string;
  type: string;
  origin_server_ts: number;
  content: Record<string, unknown>;
  unsigned?: {
    redacted_because?: unknown;
  };
};

export type MatrixActionClientOpts = {
  client?: MatrixClient;
  timeoutMs?: number;
  accountId?: string | null;
};

export type MatrixMessageSummary = {
  eventId?: string;
  sender?: string;
  body?: string;
  msgtype?: string;
  timestamp?: number;
  relatesTo?: {
    relType?: string;
    eventId?: string;
    key?: string;
  };
};

export type MatrixReactionSummary = {
  key: string;
  count: number;
  users: string[];
};

export type MatrixActionClient = {
  client: MatrixClient;
  stopOnDone: boolean;
};
