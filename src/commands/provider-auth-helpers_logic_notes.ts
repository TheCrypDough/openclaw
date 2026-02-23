/*
 * AUTO ANNOTATION
 * File: src/commands/provider-auth-helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeProviderId } from "../agents/model-selection.js";
import type { OpenClawConfig } from "../config/config.js";
import type { ProviderAuthMethod, ProviderPlugin } from "../plugins/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveProviderMatch(
  providers: ProviderPlugin[],
  rawProvider?: string,
): ProviderPlugin | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = rawProvider?.trim();
  if (!raw) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeProviderId(raw);
  return (
    providers.find((provider) => normalizeProviderId(provider.id) === normalized) ??
    providers.find(
      (provider) =>
        provider.aliases?.some((alias) => normalizeProviderId(alias) === normalized) ?? false,
    ) ??
    null
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function pickAuthMethod(
  provider: ProviderPlugin,
  rawMethod?: string,
): ProviderAuthMethod | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = rawMethod?.trim();
  if (!raw) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = raw.toLowerCase();
  return (
    provider.auth.find((method) => method.id.toLowerCase() === normalized) ??
    provider.auth.find((method) => method.label.toLowerCase() === normalized) ??
    null
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function mergeConfigPatch<T>(base: T, patch: unknown): T {
  if (!isPlainRecord(base) || !isPlainRecord(patch)) {
    return patch as T;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const next: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const existing = next[key];
    if (isPlainRecord(existing) && isPlainRecord(value)) {
      next[key] = mergeConfigPatch(existing, value);
    } else {
      next[key] = value;
    }
  }
  return next as T;
}

export function applyDefaultModel(cfg: OpenClawConfig, model: string): OpenClawConfig {
  const models = { ...cfg.agents?.defaults?.models };
  models[model] = models[model] ?? {};

  const existingModel = cfg.agents?.defaults?.model;
  return {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...cfg.agents?.defaults,
        models,
        model: {
          ...(existingModel && typeof existingModel === "object" && "fallbacks" in existingModel
            ? { fallbacks: (existingModel as { fallbacks?: string[] }).fallbacks }
            : undefined),
          primary: model,
        },
      },
    },
  };
}
