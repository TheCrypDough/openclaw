/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/urbit/send.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { scot, da } from "@urbit/aura";

export type TlonPokeApi = {
  poke: (params: { app: string; mark: string; json: unknown }) => Promise<unknown>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SendTextParams = {
  api: TlonPokeApi;
  fromShip: string;
  toShip: string;
  text: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function sendDm({ api, fromShip, toShip, text }: SendTextParams) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const story = [{ inline: [text] }];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sentAt = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const idUd = scot("ud", da.fromUnix(sentAt));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const id = `${fromShip}/${idUd}`;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const delta = {
    add: {
      memo: {
        content: story,
        author: fromShip,
        sent: sentAt,
      },
      kind: null,
      time: null,
    },
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const action = {
    ship: toShip,
    diff: { id, delta },
  };

  await api.poke({
    app: "chat",
    mark: "chat-dm-action",
    json: action,
  });

  return { channel: "tlon", messageId: id };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SendGroupParams = {
  api: TlonPokeApi;
  fromShip: string;
  hostShip: string;
  channelName: string;
  text: string;
  replyToId?: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function sendGroupMessage({
  api,
  fromShip,
  hostShip,
  channelName,
  text,
  replyToId,
}: SendGroupParams) {
  const story = [{ inline: [text] }];
  const sentAt = Date.now();

  // Format reply ID as @ud (with dots) - required for Tlon to recognize thread replies
  let formattedReplyId = replyToId;
  if (replyToId && /^\d+$/.test(replyToId)) {
    try {
      formattedReplyId = scot("ud", BigInt(replyToId));
    } catch {
      // Fall back to raw ID if formatting fails
    }
  }

  const action = {
    channel: {
      nest: `chat/${hostShip}/${channelName}`,
      action: formattedReplyId
        ? {
            // Thread reply - needs post wrapper around reply action
            // ReplyActionAdd takes Memo: {content, author, sent} - no kind/blob/meta
            post: {
              reply: {
                id: formattedReplyId,
                action: {
                  add: {
                    content: story,
                    author: fromShip,
                    sent: sentAt,
                  },
                },
              },
            },
          }
        : {
            // Regular post
            post: {
              add: {
                content: story,
                author: fromShip,
                sent: sentAt,
                kind: "/chat",
                blob: null,
                meta: null,
              },
            },
          },
    },
  };

  await api.poke({
    app: "channels",
    mark: "channel-action-1",
    json: action,
  });

  return { channel: "tlon", messageId: `${fromShip}/${sentAt}` };
}

export function buildMediaText(text: string | undefined, mediaUrl: string | undefined): string {
  const cleanText = text?.trim() ?? "";
  const cleanUrl = mediaUrl?.trim() ?? "";
  if (cleanText && cleanUrl) {
    return `${cleanText}\n${cleanUrl}`;
  }
  if (cleanUrl) {
    return cleanUrl;
  }
  return cleanText;
}
