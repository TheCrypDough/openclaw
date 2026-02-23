/*
 * AUTO ANNOTATION
 * File: extensions/synology-chat/src/runtime.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Plugin runtime singleton.
 * Stores the PluginRuntime from api.runtime (set during register()).
 * Used by channel.ts to access dispatch functions.
 */

import type { PluginRuntime } from "openclaw/plugin-sdk";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let runtime: PluginRuntime | null = null;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setSynologyRuntime(r: PluginRuntime): void {
  runtime = r;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getSynologyRuntime(): PluginRuntime {
  if (!runtime) {
    throw new Error("Synology Chat runtime not initialized - plugin not registered");
  }
  return runtime;
}
