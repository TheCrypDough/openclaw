# AUTOPLACEHOLDER_ANNOTATION: src/config/merge-config.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import type { OpenClawConfig } from "./config.js";
import type { WhatsAppConfig } from "./types.js";

export type MergeSectionOptions<T> = {
  unsetOnUndefined?: Array<keyof T>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function mergeConfigSection<T extends Record<string, unknown>>(
  base: T | undefined,
  patch: Partial<T>,
  options: MergeSectionOptions<T> = {},
): T {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const next: Record<string, unknown> = { ...(base ?? undefined) };
  for (const [key, value] of Object.entries(patch) as [keyof T, T[keyof T]][]) {
    if (value === undefined) {
      if (options.unsetOnUndefined?.includes(key)) {
        delete next[key as string];
      }
      continue;
    }
    next[key as string] = value as unknown;
  }
  return next as T;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function mergeWhatsAppConfig(
  cfg: OpenClawConfig,
  patch: Partial<WhatsAppConfig>,
  options?: MergeSectionOptions<WhatsAppConfig>,
): OpenClawConfig {
  return {
    ...cfg,
    channels: {
      ...cfg.channels,
      whatsapp: mergeConfigSection(cfg.channels?.whatsapp, patch, options),
    },
  };
}
