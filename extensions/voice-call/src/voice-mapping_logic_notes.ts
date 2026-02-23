/*
 * AUTO ANNOTATION
 * File: extensions/voice-call/src/voice-mapping.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Voice mapping and XML utilities for voice call providers.
 */

/**
 * Escape XML special characters for TwiML and other XML responses.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Map of OpenAI voice names to similar Twilio Polly voices.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const OPENAI_TO_POLLY_MAP: Record<string, string> = {
  alloy: "Polly.Joanna", // neutral, warm
  echo: "Polly.Matthew", // male, warm
  fable: "Polly.Amy", // British, expressive
  onyx: "Polly.Brian", // deep male
  nova: "Polly.Salli", // female, friendly
  shimmer: "Polly.Kimberly", // female, clear
};

/**
 * Default Polly voice when no mapping is found.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_POLLY_VOICE = "Polly.Joanna";

/**
 * Map OpenAI voice names to Twilio Polly equivalents.
 * Falls through if already a valid Polly/Google voice.
 *
 * @param voice - OpenAI voice name (alloy, echo, etc.) or Polly voice name
 * @returns Polly voice name suitable for Twilio TwiML
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function mapVoiceToPolly(voice: string | undefined): string {
  if (!voice) {
    return DEFAULT_POLLY_VOICE;
  }

  // Already a Polly/Google voice - pass through
  if (voice.startsWith("Polly.") || voice.startsWith("Google.")) {
    return voice;
  }

  // Map OpenAI voices to Polly equivalents
  return OPENAI_TO_POLLY_MAP[voice.toLowerCase()] || DEFAULT_POLLY_VOICE;
}

/**
 * Check if a voice name is a known OpenAI voice.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isOpenAiVoice(voice: string): boolean {
  return voice.toLowerCase() in OPENAI_TO_POLLY_MAP;
}

/**
 * Get all supported OpenAI voice names.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getOpenAiVoiceNames(): string[] {
  return Object.keys(OPENAI_TO_POLLY_MAP);
}
