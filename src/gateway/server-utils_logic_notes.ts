/*
 * AUTO ANNOTATION
 * File: src/gateway/server-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { defaultVoiceWakeTriggers } from "../infra/voicewake.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeVoiceWakeTriggers(input: unknown): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = Array.isArray(input) ? input : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = raw
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((v) => v.length > 0)
    .slice(0, 32)
    .map((v) => v.slice(0, 64));
  return cleaned.length > 0 ? cleaned : defaultVoiceWakeTriggers();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "string") {
    return err;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const statusValue = (err as { status?: unknown })?.status;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const codeValue = (err as { code?: unknown })?.code;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasStatus = statusValue !== undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasCode = codeValue !== undefined;
  if (hasStatus || hasCode) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const statusText =
      typeof statusValue === "string" || typeof statusValue === "number"
        ? String(statusValue)
        : "unknown";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const codeText =
      typeof codeValue === "string" || typeof codeValue === "number"
        ? String(codeValue)
        : "unknown";
    return `status=${statusText} code=${codeText}`;
  }
  try {
    return JSON.stringify(err, null, 2);
  } catch {
    return String(err);
  }
}
