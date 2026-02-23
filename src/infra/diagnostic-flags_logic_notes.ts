/*
 * AUTO ANNOTATION
 * File: src/infra/diagnostic-flags.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DIAGNOSTICS_ENV = "OPENCLAW_DIAGNOSTICS";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeFlag(value: string): string {
  return value.trim().toLowerCase();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseEnvFlags(raw?: string): string[] {
  if (!raw) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
  if (!trimmed) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lowered = trimmed.toLowerCase();
  if (["0", "false", "off", "none"].includes(lowered)) {
    return [];
  }
  if (["1", "true", "all", "*"].includes(lowered)) {
    return ["*"];
  }
  return trimmed
    .split(/[,\s]+/)
    .map(normalizeFlag)
    .filter(Boolean);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function uniqueFlags(flags: string[]): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const seen = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const out: string[] = [];
  for (const flag of flags) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalizeFlag(flag);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDiagnosticFlags(
  cfg?: OpenClawConfig,
  env: NodeJS.ProcessEnv = process.env,
): string[] {
  const configFlags = Array.isArray(cfg?.diagnostics?.flags) ? cfg?.diagnostics?.flags : [];
  const envFlags = parseEnvFlags(env[DIAGNOSTICS_ENV]);
  return uniqueFlags([...configFlags, ...envFlags]);
}

export function matchesDiagnosticFlag(flag: string, enabledFlags: string[]): boolean {
  const target = normalizeFlag(flag);
  if (!target) {
    return false;
  }
  for (const raw of enabledFlags) {
    const enabled = normalizeFlag(raw);
    if (!enabled) {
      continue;
    }
    if (enabled === "*" || enabled === "all") {
      return true;
    }
    if (enabled.endsWith(".*")) {
      const prefix = enabled.slice(0, -2);
      if (target === prefix || target.startsWith(`${prefix}.`)) {
        return true;
      }
    }
    if (enabled.endsWith("*")) {
      const prefix = enabled.slice(0, -1);
      if (target.startsWith(prefix)) {
        return true;
      }
    }
    if (enabled === target) {
      return true;
    }
  }
  return false;
}

export function isDiagnosticFlagEnabled(
  flag: string,
  cfg?: OpenClawConfig,
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const flags = resolveDiagnosticFlags(cfg, env);
  return matchesDiagnosticFlag(flag, flags);
}
