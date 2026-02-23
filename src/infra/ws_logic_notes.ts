/*
 * AUTO ANNOTATION
 * File: src/infra/ws.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Buffer } from "node:buffer";
import type WebSocket from "ws";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function rawDataToString(
  data: WebSocket.RawData,
  encoding: BufferEncoding = "utf8",
): string {
  if (typeof data === "string") {
    return data;
  }
  if (Buffer.isBuffer(data)) {
    return data.toString(encoding);
  }
  if (Array.isArray(data)) {
    return Buffer.concat(data).toString(encoding);
  }
  if (data instanceof ArrayBuffer) {
    return Buffer.from(data).toString(encoding);
  }
  return Buffer.from(String(data)).toString(encoding);
}
