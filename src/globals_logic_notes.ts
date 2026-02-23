/*
 * AUTO ANNOTATION
 * File: src/globals.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getLogger, isFileLogLevelEnabled } from "./logging/logger.js";
import { theme } from "./terminal/theme.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let globalVerbose = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let globalYes = false;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setVerbose(v: boolean) {
  globalVerbose = v;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isVerbose() {
  return globalVerbose;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function shouldLogVerbose() {
  return globalVerbose || isFileLogLevelEnabled("debug");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function logVerbose(message: string) {
  if (!shouldLogVerbose()) {
    return;
  }
  try {
    getLogger().debug({ message }, "verbose");
  } catch {
    // ignore logger failures to avoid breaking verbose printing
  }
  if (!globalVerbose) {
    return;
  }
  console.log(theme.muted(message));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function logVerboseConsole(message: string) {
  if (!globalVerbose) {
    return;
  }
  console.log(theme.muted(message));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setYes(v: boolean) {
  globalYes = v;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isYes() {
  return globalYes;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const success = theme.success;
export const warn = theme.warn;
export const info = theme.info;
export const danger = theme.error;
