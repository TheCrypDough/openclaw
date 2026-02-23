/*
 * AUTO ANNOTATION
 * File: src/browser/proxy-files.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { saveMediaBuffer } from "../media/store.js";

export type BrowserProxyFile = {
  path: string;
  base64: string;
  mimeType?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function persistBrowserProxyFiles(files: BrowserProxyFile[] | undefined) {
  if (!files || files.length === 0) {
    return new Map<string, string>();
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mapping = new Map<string, string>();
  for (const file of files) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const buffer = Buffer.from(file.base64, "base64");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const saved = await saveMediaBuffer(buffer, file.mimeType, "browser", buffer.byteLength);
    mapping.set(file.path, saved.path);
  }
  return mapping;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyBrowserProxyPaths(result: unknown, mapping: Map<string, string>) {
  if (!result || typeof result !== "object") {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const obj = result as Record<string, unknown>;
  if (typeof obj.path === "string" && mapping.has(obj.path)) {
    obj.path = mapping.get(obj.path);
  }
  if (typeof obj.imagePath === "string" && mapping.has(obj.imagePath)) {
    obj.imagePath = mapping.get(obj.imagePath);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const download = obj.download;
  if (download && typeof download === "object") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const d = download as Record<string, unknown>;
    if (typeof d.path === "string" && mapping.has(d.path)) {
      d.path = mapping.get(d.path);
    }
  }
}
