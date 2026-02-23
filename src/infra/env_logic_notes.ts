/*
 * AUTO ANNOTATION
 * File: src/infra/env.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createSubsystemLogger } from "../logging/subsystem.js";
import { parseBooleanValue } from "../utils/boolean.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("env");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const loggedEnv = new Set<string>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AcceptedEnvOption = {
  key: string;
  description: string;
  value?: string;
  redact?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatEnvValue(value: string, redact?: boolean): string {
  if (redact) {
    return "<redacted>";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const singleLine = value.replace(/\s+/g, " ").trim();
  if (singleLine.length <= 160) {
    return singleLine;
  }
  return `${singleLine.slice(0, 160)}…`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function logAcceptedEnvOption(option: AcceptedEnvOption): void {
  if (process.env.VITEST || process.env.NODE_ENV === "test") {
    return;
  }
  if (loggedEnv.has(option.key)) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rawValue = option.value ?? process.env[option.key];
  if (!rawValue || !rawValue.trim()) {
    return;
  }
  loggedEnv.add(option.key);
  log.info(`env: ${option.key}=${formatEnvValue(rawValue, option.redact)} (${option.description})`);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeZaiEnv(): void {
  if (!process.env.ZAI_API_KEY?.trim() && process.env.Z_AI_API_KEY?.trim()) {
    process.env.ZAI_API_KEY = process.env.Z_AI_API_KEY;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isTruthyEnvValue(value?: string): boolean {
  return parseBooleanValue(value) === true;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeEnv(): void {
  normalizeZaiEnv();
}
