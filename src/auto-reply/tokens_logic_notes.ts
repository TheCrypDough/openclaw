/*
 * AUTO ANNOTATION
 * File: src/auto-reply/tokens.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { escapeRegExp } from "../utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const HEARTBEAT_TOKEN = "HEARTBEAT_OK";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SILENT_REPLY_TOKEN = "NO_REPLY";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isSilentReplyText(
  text: string | undefined,
  token: string = SILENT_REPLY_TOKEN,
): boolean {
  if (!text) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const escaped = escapeRegExp(token);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prefix = new RegExp(`^\\s*${escaped}(?=$|\\W)`);
  if (prefix.test(text)) {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const suffix = new RegExp(`\\b${escaped}\\b\\W*$`);
  return suffix.test(text);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isSilentReplyPrefixText(
  text: string | undefined,
  token: string = SILENT_REPLY_TOKEN,
): boolean {
  if (!text) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = text.trimStart().toUpperCase();
  if (!normalized) {
    return false;
  }
  if (!normalized.includes("_")) {
    return false;
  }
  if (/[^A-Z_]/.test(normalized)) {
    return false;
  }
  return token.toUpperCase().startsWith(normalized);
}
