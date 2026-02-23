/*
 * AUTO ANNOTATION
 * File: src/shared/chat-envelope.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ENVELOPE_PREFIX = /^\[([^\]]+)\]\s*/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ENVELOPE_CHANNELS = [
  "WebChat",
  "WhatsApp",
  "Telegram",
  "Signal",
  "Slack",
  "Discord",
  "Google Chat",
  "iMessage",
  "Teams",
  "Matrix",
  "Zalo",
  "Zalo Personal",
  "BlueBubbles",
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MESSAGE_ID_LINE = /^\s*\[message_id:\s*[^\]]+\]\s*$/i;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function looksLikeEnvelopeHeader(header: string): boolean {
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(header)) {
    return true;
  }
  if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(header)) {
    return true;
  }
  return ENVELOPE_CHANNELS.some((label) => header.startsWith(`${label} `));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripEnvelope(text: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = text.match(ENVELOPE_PREFIX);
  if (!match) {
    return text;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const header = match[1] ?? "";
  if (!looksLikeEnvelopeHeader(header)) {
    return text;
  }
  return text.slice(match[0].length);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripMessageIdHints(text: string): string {
  if (!text.includes("[message_id:")) {
    return text;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines = text.split(/\r?\n/);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const filtered = lines.filter((line) => !MESSAGE_ID_LINE.test(line));
  return filtered.length === lines.length ? text : filtered.join("\n");
}
