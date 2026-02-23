/*
 * AUTO ANNOTATION
 * File: src/agents/image-sanitization.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";

export type ImageSanitizationLimits = {
  maxDimensionPx?: number;
  maxBytes?: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_IMAGE_MAX_DIMENSION_PX = 1200;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveImageSanitizationLimits(cfg?: OpenClawConfig): ImageSanitizationLimits {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configured = cfg?.agents?.defaults?.imageMaxDimensionPx;
  if (typeof configured !== "number" || !Number.isFinite(configured)) {
    return {};
  }
  return { maxDimensionPx: Math.max(1, Math.floor(configured)) };
}
