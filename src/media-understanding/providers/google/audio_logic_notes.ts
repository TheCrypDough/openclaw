/*
 * AUTO ANNOTATION
 * File: src/media-understanding/providers/google/audio.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AudioTranscriptionRequest, AudioTranscriptionResult } from "../../types.js";
import { generateGeminiInlineDataText } from "./inline-data.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_GOOGLE_AUDIO_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_GOOGLE_AUDIO_MODEL = "gemini-3-flash-preview";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_GOOGLE_AUDIO_PROMPT = "Transcribe the audio.";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function transcribeGeminiAudio(
  params: AudioTranscriptionRequest,
): Promise<AudioTranscriptionResult> {
  const { text, model } = await generateGeminiInlineDataText({
    ...params,
    defaultBaseUrl: DEFAULT_GOOGLE_AUDIO_BASE_URL,
    defaultModel: DEFAULT_GOOGLE_AUDIO_MODEL,
    defaultPrompt: DEFAULT_GOOGLE_AUDIO_PROMPT,
    defaultMime: "audio/wav",
    httpErrorLabel: "Audio transcription failed",
    missingTextError: "Audio transcription response missing text",
  });
  return { text, model };
}
