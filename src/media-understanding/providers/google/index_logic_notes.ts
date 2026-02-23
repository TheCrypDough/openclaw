/*
 * AUTO ANNOTATION
 * File: src/media-understanding/providers/google/index.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MediaUnderstandingProvider } from "../../types.js";
import { describeImageWithModel } from "../image.js";
import { transcribeGeminiAudio } from "./audio.js";
import { describeGeminiVideo } from "./video.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const googleProvider: MediaUnderstandingProvider = {
  id: "google",
  capabilities: ["image", "audio", "video"],
  describeImage: describeImageWithModel,
  transcribeAudio: transcribeGeminiAudio,
  describeVideo: describeGeminiVideo,
};
