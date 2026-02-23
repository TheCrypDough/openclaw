/*
 * AUTO ANNOTATION
 * File: src/cli/nodes-canvas.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import * as path from "node:path";
import { resolveCliName } from "./cli-name.js";
import { asRecord, asString, resolveTempPathParts } from "./nodes-media-utils.js";

export type CanvasSnapshotPayload = {
  format: string;
  base64: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseCanvasSnapshotPayload(value: unknown): CanvasSnapshotPayload {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const obj = asRecord(value);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const format = asString(obj.format);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base64 = asString(obj.base64);
  if (!format || !base64) {
    throw new Error("invalid canvas.snapshot payload");
  }
  return { format, base64 };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function canvasSnapshotTempPath(opts: { ext: string; tmpDir?: string; id?: string }) {
  const { tmpDir, id, ext } = resolveTempPathParts(opts);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cliName = resolveCliName();
  return path.join(tmpDir, `${cliName}-canvas-snapshot-${id}${ext}`);
}
