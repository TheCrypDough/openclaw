/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/monitor/threads.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
// Type for raw Matrix event from @vector-im/matrix-bot-sdk
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MatrixRawEvent = {
  event_id: string;
  sender: string;
  type: string;
  origin_server_ts: number;
  content: Record<string, unknown>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type RoomMessageEventContent = {
  msgtype: string;
  body: string;
  "m.relates_to"?: {
    rel_type?: string;
    event_id?: string;
    "m.in_reply_to"?: { event_id?: string };
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RelationType = {
  Thread: "m.thread",
} as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveMatrixThreadTarget(params: {
  threadReplies: "off" | "inbound" | "always";
  messageId: string;
  threadRootId?: string;
  isThreadRoot?: boolean;
}): string | undefined {
  const { threadReplies, messageId, threadRootId } = params;
  if (threadReplies === "off") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isThreadRoot = params.isThreadRoot === true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasInboundThread = Boolean(threadRootId && threadRootId !== messageId && !isThreadRoot);
  if (threadReplies === "inbound") {
    return hasInboundThread ? threadRootId : undefined;
  }
  if (threadReplies === "always") {
    return threadRootId ?? messageId;
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveMatrixThreadRootId(params: {
  event: MatrixRawEvent;
  content: RoomMessageEventContent;
}): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const relates = params.content["m.relates_to"];
  if (!relates || typeof relates !== "object") {
    return undefined;
  }
  if ("rel_type" in relates && relates.rel_type === RelationType.Thread) {
    if ("event_id" in relates && typeof relates.event_id === "string") {
      return relates.event_id;
    }
    if (
      "m.in_reply_to" in relates &&
      typeof relates["m.in_reply_to"] === "object" &&
      relates["m.in_reply_to"] &&
      "event_id" in relates["m.in_reply_to"] &&
      typeof relates["m.in_reply_to"].event_id === "string"
    ) {
      return relates["m.in_reply_to"].event_id;
    }
  }
  return undefined;
}
