/*
 * AUTO ANNOTATION
 * File: src/config/env-vars.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isDangerousHostEnvVarName, normalizeEnvVarKey } from "../infra/host-env-security.js";
import type { OpenClawConfig } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function collectConfigEnvVarsByTarget(cfg?: OpenClawConfig): Record<string, string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const envConfig = cfg?.env;
  if (!envConfig) {
    return {};
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries: Record<string, string> = {};

  if (envConfig.vars) {
    for (const [rawKey, value] of Object.entries(envConfig.vars)) {
      if (!value) {
        continue;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const key = normalizeEnvVarKey(rawKey, { portable: true });
      if (!key) {
        continue;
      }
      if (isDangerousHostEnvVarName(key)) {
        continue;
      }
      entries[key] = value;
    }
  }

  for (const [rawKey, value] of Object.entries(envConfig)) {
    if (rawKey === "shellEnv" || rawKey === "vars") {
      continue;
    }
    if (typeof value !== "string" || !value.trim()) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const key = normalizeEnvVarKey(rawKey, { portable: true });
    if (!key) {
      continue;
    }
    if (isDangerousHostEnvVarName(key)) {
      continue;
    }
    entries[key] = value;
  }

  return entries;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function collectConfigRuntimeEnvVars(cfg?: OpenClawConfig): Record<string, string> {
  return collectConfigEnvVarsByTarget(cfg);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function collectConfigServiceEnvVars(cfg?: OpenClawConfig): Record<string, string> {
  return collectConfigEnvVarsByTarget(cfg);
}

/** @deprecated Use `collectConfigRuntimeEnvVars` or `collectConfigServiceEnvVars`. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function collectConfigEnvVars(cfg?: OpenClawConfig): Record<string, string> {
  return collectConfigRuntimeEnvVars(cfg);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyConfigEnvVars(
  cfg: OpenClawConfig,
  env: NodeJS.ProcessEnv = process.env,
): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries = collectConfigRuntimeEnvVars(cfg);
  for (const [key, value] of Object.entries(entries)) {
    if (env[key]?.trim()) {
      continue;
    }
    env[key] = value;
  }
}
