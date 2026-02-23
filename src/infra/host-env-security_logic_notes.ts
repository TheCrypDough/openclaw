/*
 * AUTO ANNOTATION
 * File: src/infra/host-env-security.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import HOST_ENV_SECURITY_POLICY_JSON from "./host-env-security-policy.json" with { type: "json" };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const PORTABLE_ENV_VAR_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type HostEnvSecurityPolicy = {
  blockedKeys: string[];
  blockedPrefixes: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const HOST_ENV_SECURITY_POLICY = HOST_ENV_SECURITY_POLICY_JSON as HostEnvSecurityPolicy;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const HOST_DANGEROUS_ENV_KEY_VALUES: readonly string[] = Object.freeze(
  HOST_ENV_SECURITY_POLICY.blockedKeys.map((key) => key.toUpperCase()),
);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const HOST_DANGEROUS_ENV_PREFIXES: readonly string[] = Object.freeze(
  HOST_ENV_SECURITY_POLICY.blockedPrefixes.map((prefix) => prefix.toUpperCase()),
);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const HOST_DANGEROUS_ENV_KEYS = new Set<string>(HOST_DANGEROUS_ENV_KEY_VALUES);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeEnvVarKey(
  rawKey: string,
  options?: { portable?: boolean },
): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = rawKey.trim();
  if (!key) {
    return null;
  }
  if (options?.portable && !PORTABLE_ENV_VAR_KEY.test(key)) {
    return null;
  }
  return key;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isDangerousHostEnvVarName(rawKey: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = normalizeEnvVarKey(rawKey);
  if (!key) {
    return false;
  }
  const upper = key.toUpperCase();
  if (HOST_DANGEROUS_ENV_KEYS.has(upper)) {
    return true;
  }
  return HOST_DANGEROUS_ENV_PREFIXES.some((prefix) => upper.startsWith(prefix));
}

export function sanitizeHostExecEnv(params?: {
  baseEnv?: Record<string, string | undefined>;
  overrides?: Record<string, string> | null;
  blockPathOverrides?: boolean;
}): Record<string, string> {
  const baseEnv = params?.baseEnv ?? process.env;
  const overrides = params?.overrides ?? undefined;
  const blockPathOverrides = params?.blockPathOverrides ?? true;

  const merged: Record<string, string> = {};
  for (const [rawKey, value] of Object.entries(baseEnv)) {
    if (typeof value !== "string") {
      continue;
    }
    const key = normalizeEnvVarKey(rawKey, { portable: true });
    if (!key || isDangerousHostEnvVarName(key)) {
      continue;
    }
    merged[key] = value;
  }

  if (!overrides) {
    return merged;
  }

  for (const [rawKey, value] of Object.entries(overrides)) {
    if (typeof value !== "string") {
      continue;
    }
    const key = normalizeEnvVarKey(rawKey, { portable: true });
    if (!key) {
      continue;
    }
    const upper = key.toUpperCase();
    // PATH is part of the security boundary (command resolution + safe-bin checks). Never allow
    // request-scoped PATH overrides from agents/gateways.
    if (blockPathOverrides && upper === "PATH") {
      continue;
    }
    if (isDangerousHostEnvVarName(upper)) {
      continue;
    }
    merged[key] = value;
  }

  return merged;
}
