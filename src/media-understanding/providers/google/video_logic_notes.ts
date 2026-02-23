/*
 * AUTO ANNOTATION
 * File: src/media-understanding/providers/google/video.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { VideoDescriptionRequest, VideoDescriptionResult } from "../../types.js";
import { generateGeminiInlineDataText } from "./inline-data.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_GOOGLE_VIDEO_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_GOOGLE_VIDEO_MODEL = "gemini-3-flash-preview";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_GOOGLE_VIDEO_PROMPT = "Describe the video.";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function describeGeminiVideo(
  params: VideoDescriptionRequest,
): Promise<VideoDescriptionResult> {
  const { text, model } = await generateGeminiInlineDataText({
    ...params,
    defaultBaseUrl: DEFAULT_GOOGLE_VIDEO_BASE_URL,
    defaultModel: DEFAULT_GOOGLE_VIDEO_MODEL,
    defaultPrompt: DEFAULT_GOOGLE_VIDEO_PROMPT,
    defaultMime: "video/mp4",
    httpErrorLabel: "Video description failed",
    missingTextError: "Video description response missing text",
  });
  return { text, model };
}
