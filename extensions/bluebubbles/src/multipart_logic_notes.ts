/*
 * AUTO ANNOTATION
 * File: extensions/bluebubbles/src/multipart.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { blueBubblesFetchWithTimeout } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function concatUint8Arrays(parts: Uint8Array[]): Uint8Array {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const totalLength = parts.reduce((acc, part) => acc + part.length, 0);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const body = new Uint8Array(totalLength);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let offset = 0;
  for (const part of parts) {
    body.set(part, offset);
    offset += part.length;
  }
  return body;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function postMultipartFormData(params: {
  url: string;
  boundary: string;
  parts: Uint8Array[];
  timeoutMs: number;
}): Promise<Response> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const body = Buffer.from(concatUint8Arrays(params.parts));
  return await blueBubblesFetchWithTimeout(
    params.url,
    {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${params.boundary}`,
      },
      body,
    },
    params.timeoutMs,
  );
}
