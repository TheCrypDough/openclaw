/*
 * AUTO ANNOTATION
 * File: src/config/plugins-allowlist.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "./config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function ensurePluginAllowlisted(cfg: OpenClawConfig, pluginId: string): OpenClawConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) {
    return cfg;
  }
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  };
}
