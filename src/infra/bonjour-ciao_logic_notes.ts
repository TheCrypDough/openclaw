/*
 * AUTO ANNOTATION
 * File: src/infra/bonjour-ciao.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { logDebug } from "../logger.js";
import { formatBonjourError } from "./bonjour-errors.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function ignoreCiaoCancellationRejection(reason: unknown): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const message = formatBonjourError(reason).toUpperCase();
  if (!message.includes("CIAO ANNOUNCEMENT CANCELLED")) {
    return false;
  }
  logDebug(`bonjour: ignoring unhandled ciao rejection: ${formatBonjourError(reason)}`);
  return true;
}
