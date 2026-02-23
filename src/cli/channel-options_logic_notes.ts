/*
 * AUTO ANNOTATION
 * File: src/cli/channel-options.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { listChannelPluginCatalogEntries } from "../channels/plugins/catalog.js";
import { listChannelPlugins } from "../channels/plugins/index.js";
import { CHAT_CHANNEL_ORDER } from "../channels/registry.js";
import { isTruthyEnvValue } from "../infra/env.js";
import { ensurePluginRegistryLoaded } from "./plugin-registry.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function dedupe(values: string[]): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const seen = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved: string[] = [];
  for (const value of values) {
    if (!value || seen.has(value)) {
      continue;
    }
    seen.add(value);
    resolved.push(value);
  }
  return resolved;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveCliChannelOptions(): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const catalog = listChannelPluginCatalogEntries().map((entry) => entry.id);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = dedupe([...CHAT_CHANNEL_ORDER, ...catalog]);
  if (isTruthyEnvValue(process.env.OPENCLAW_EAGER_CHANNEL_OPTIONS)) {
    ensurePluginRegistryLoaded();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pluginIds = listChannelPlugins().map((plugin) => plugin.id);
    return dedupe([...base, ...pluginIds]);
  }
  return base;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatCliChannelOptions(extra: string[] = []): string {
  return [...extra, ...resolveCliChannelOptions()].join("|");
}
