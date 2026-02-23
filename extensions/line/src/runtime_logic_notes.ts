/*
 * AUTO ANNOTATION
 * File: extensions/line/src/runtime.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { PluginRuntime } from "openclaw/plugin-sdk";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let runtime: PluginRuntime | null = null;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setLineRuntime(r: PluginRuntime): void {
  runtime = r;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getLineRuntime(): PluginRuntime {
  if (!runtime) {
    throw new Error("LINE runtime not initialized - plugin not registered");
  }
  return runtime;
}
