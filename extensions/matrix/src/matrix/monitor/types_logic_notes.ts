/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/monitor/types.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { EncryptedFile, MessageEventContent } from "@vector-im/matrix-bot-sdk";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const EventType = {
  RoomMessage: "m.room.message",
  RoomMessageEncrypted: "m.room.encrypted",
  RoomMember: "m.room.member",
  Location: "m.location",
} as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const RelationType = {
  Replace: "m.replace",
  Thread: "m.thread",
} as const;

export type MatrixRawEvent = {
  event_id: string;
  sender: string;
  type: string;
  origin_server_ts: number;
  content: Record<string, unknown>;
  unsigned?: {
    age?: number;
    redacted_because?: unknown;
  };
};

export type RoomMessageEventContent = MessageEventContent & {
  url?: string;
  file?: EncryptedFile;
  info?: {
    mimetype?: string;
    size?: number;
  };
  "m.relates_to"?: {
    rel_type?: string;
    event_id?: string;
    "m.in_reply_to"?: { event_id?: string };
  };
};
