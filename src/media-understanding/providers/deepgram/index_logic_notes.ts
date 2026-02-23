/*
 * AUTO ANNOTATION
 * File: src/media-understanding/providers/deepgram/index.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MediaUnderstandingProvider } from "../../types.js";
import { transcribeDeepgramAudio } from "./audio.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const deepgramProvider: MediaUnderstandingProvider = {
  id: "deepgram",
  capabilities: ["audio"],
  transcribeAudio: transcribeDeepgramAudio,
};
