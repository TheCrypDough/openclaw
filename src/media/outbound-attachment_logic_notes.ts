/*
 * AUTO ANNOTATION
 * File: src/media/outbound-attachment.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { loadWebMedia } from "../web/media.js";
import { saveMediaBuffer } from "./store.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveOutboundAttachmentFromUrl(
  mediaUrl: string,
  maxBytes: number,
  options?: { localRoots?: readonly string[] },
): Promise<{ path: string; contentType?: string }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const media = await loadWebMedia(mediaUrl, {
    maxBytes,
    localRoots: options?.localRoots,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const saved = await saveMediaBuffer(
    media.buffer,
    media.contentType ?? undefined,
    "outbound",
    maxBytes,
  );
  return { path: saved.path, contentType: saved.contentType };
}
