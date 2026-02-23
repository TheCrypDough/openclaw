/*
 * AUTO ANNOTATION
 * File: src/commands/google-gemini-model-default.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import { applyAgentDefaultPrimaryModel } from "./model-default.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const GOOGLE_GEMINI_DEFAULT_MODEL = "google/gemini-3-pro-preview";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyGoogleGeminiModelDefault(cfg: OpenClawConfig): {
  next: OpenClawConfig;
  changed: boolean;
} {
  return applyAgentDefaultPrimaryModel({ cfg, model: GOOGLE_GEMINI_DEFAULT_MODEL });
}
