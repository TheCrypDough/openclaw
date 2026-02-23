/*
 * AUTO ANNOTATION
 * File: src/web/inbound/media.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { proto, WAMessage } from "@whiskeysockets/baileys";
import { downloadMediaMessage, normalizeMessageContent } from "@whiskeysockets/baileys";
import { logVerbose } from "../../globals.js";
import type { createWaSocket } from "../session.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function unwrapMessage(message: proto.IMessage | undefined): proto.IMessage | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeMessageContent(message);
  return normalized;
}

/**
 * Resolve the MIME type for an inbound media message.
 * Falls back to WhatsApp's standard formats when Baileys omits the MIME.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveMediaMimetype(message: proto.IMessage): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const explicit =
    message.imageMessage?.mimetype ??
    message.videoMessage?.mimetype ??
    message.documentMessage?.mimetype ??
    message.audioMessage?.mimetype ??
    message.stickerMessage?.mimetype ??
    undefined;
  if (explicit) {
    return explicit;
  }
  // WhatsApp voice messages (PTT) and audio use OGG Opus by default
  if (message.audioMessage) {
    return "audio/ogg; codecs=opus";
  }
  if (message.imageMessage) {
    return "image/jpeg";
  }
  if (message.videoMessage) {
    return "video/mp4";
  }
  if (message.stickerMessage) {
    return "image/webp";
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function downloadInboundMedia(
  msg: proto.IWebMessageInfo,
  sock: Awaited<ReturnType<typeof createWaSocket>>,
): Promise<{ buffer: Buffer; mimetype?: string; fileName?: string } | undefined> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const message = unwrapMessage(msg.message as proto.IMessage | undefined);
  if (!message) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mimetype = resolveMediaMimetype(message);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fileName = message.documentMessage?.fileName ?? undefined;
  if (
    !message.imageMessage &&
    !message.videoMessage &&
    !message.documentMessage &&
    !message.audioMessage &&
    !message.stickerMessage
  ) {
    return undefined;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const buffer = await downloadMediaMessage(
      msg as WAMessage,
      "buffer",
      {},
      {
        reuploadRequest: sock.updateMediaMessage,
        logger: sock.logger,
      },
    );
    return { buffer, mimetype, fileName };
  } catch (err) {
    logVerbose(`downloadMediaMessage failed: ${String(err)}`);
    return undefined;
  }
}
