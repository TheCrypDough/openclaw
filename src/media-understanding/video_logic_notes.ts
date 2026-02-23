/*
 * AUTO ANNOTATION
 * File: src/media-understanding/video.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { DEFAULT_VIDEO_MAX_BASE64_BYTES } from "./defaults.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function estimateBase64Size(bytes: number): number {
  return Math.ceil(bytes / 3) * 4;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveVideoMaxBase64Bytes(maxBytes: number): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const expanded = Math.floor(maxBytes * (4 / 3));
  return Math.min(expanded, DEFAULT_VIDEO_MAX_BASE64_BYTES);
}
