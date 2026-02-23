/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner/abort.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Runner abort check. Catches any abort-related message for embedded runners.
 * More permissive than the core isAbortError since runners need to catch
 * various abort signals from different sources.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isRunnerAbortError(err: unknown): boolean {
  if (!err || typeof err !== "object") {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const name = "name" in err ? String(err.name) : "";
  if (name === "AbortError") {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const message =
    "message" in err && typeof err.message === "string" ? err.message.toLowerCase() : "";
  return message.includes("aborted");
}
