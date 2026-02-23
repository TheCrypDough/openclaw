/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/load.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { PluginRegistry } from "../../plugins/registry.js";
import { getActivePluginRegistry } from "../../plugins/runtime.js";
import type { ChannelId, ChannelPlugin } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const cache = new Map<ChannelId, ChannelPlugin>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let lastRegistry: PluginRegistry | null = null;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function ensureCacheForRegistry(registry: PluginRegistry | null) {
  if (registry === lastRegistry) {
    return;
  }
  cache.clear();
  lastRegistry = registry;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function loadChannelPlugin(id: ChannelId): Promise<ChannelPlugin | undefined> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const registry = getActivePluginRegistry();
  ensureCacheForRegistry(registry);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cached = cache.get(id);
  if (cached) {
    return cached;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pluginEntry = registry?.channels.find((entry) => entry.plugin.id === id);
  if (pluginEntry) {
    cache.set(id, pluginEntry.plugin);
    return pluginEntry.plugin;
  }
  return undefined;
}
