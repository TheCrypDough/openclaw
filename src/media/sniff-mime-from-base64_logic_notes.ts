/*
 * AUTO ANNOTATION
 * File: src/media/sniff-mime-from-base64.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { detectMime } from "./mime.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function sniffMimeFromBase64(base64: string): Promise<string | undefined> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = base64.trim();
  if (!trimmed) {
    return undefined;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const take = Math.min(256, trimmed.length);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sliceLen = take - (take % 4);
  if (sliceLen < 8) {
    return undefined;
  }

  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const head = Buffer.from(trimmed.slice(0, sliceLen), "base64");
    return await detectMime({ buffer: head });
  } catch {
    return undefined;
  }
}
