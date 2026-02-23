/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/outbound/load.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { PluginRegistry } from "../../../plugins/registry.js";
import { getActivePluginRegistry } from "../../../plugins/runtime.js";
import type { ChannelId, ChannelOutboundAdapter } from "../types.js";

// Channel docking: outbound sends should stay cheap to import.
//
// The full channel plugins (src/channels/plugins/*.ts) pull in status,
// onboarding, gateway monitors, etc. Outbound delivery only needs chunking +
// send primitives, so we keep a dedicated, lightweight loader here.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const cache = new Map<ChannelId, ChannelOutboundAdapter>();
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
export async function loadChannelOutboundAdapter(
  id: ChannelId,
): Promise<ChannelOutboundAdapter | undefined> {
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
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const outbound = pluginEntry?.plugin.outbound;
  if (outbound) {
    cache.set(id, outbound);
    return outbound;
  }
  return undefined;
}
