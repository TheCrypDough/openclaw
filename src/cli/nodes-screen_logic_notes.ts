/*
 * AUTO ANNOTATION
 * File: src/cli/nodes-screen.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import * as path from "node:path";
import { writeBase64ToFile } from "./nodes-camera.js";
import { asRecord, asString, resolveTempPathParts } from "./nodes-media-utils.js";

export type ScreenRecordPayload = {
  format: string;
  base64: string;
  durationMs?: number;
  fps?: number;
  screenIndex?: number;
  hasAudio?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseScreenRecordPayload(value: unknown): ScreenRecordPayload {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const obj = asRecord(value);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const format = asString(obj.format);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base64 = asString(obj.base64);
  if (!format || !base64) {
    throw new Error("invalid screen.record payload");
  }
  return {
    format,
    base64,
    durationMs: typeof obj.durationMs === "number" ? obj.durationMs : undefined,
    fps: typeof obj.fps === "number" ? obj.fps : undefined,
    screenIndex: typeof obj.screenIndex === "number" ? obj.screenIndex : undefined,
    hasAudio: typeof obj.hasAudio === "boolean" ? obj.hasAudio : undefined,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function screenRecordTempPath(opts: { ext: string; tmpDir?: string; id?: string }) {
  const { tmpDir, id, ext } = resolveTempPathParts(opts);
  return path.join(tmpDir, `openclaw-screen-record-${id}${ext}`);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function writeScreenRecordToFile(filePath: string, base64: string) {
  return writeBase64ToFile(filePath, base64);
}
