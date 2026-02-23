/*
 * AUTO ANNOTATION
 * File: src/plugins/runtime.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createEmptyPluginRegistry, type PluginRegistry } from "./registry.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const REGISTRY_STATE = Symbol.for("openclaw.pluginRegistryState");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type RegistryState = {
  registry: PluginRegistry | null;
  key: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const state: RegistryState = (() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const globalState = globalThis as typeof globalThis & {
    [REGISTRY_STATE]?: RegistryState;
  };
  if (!globalState[REGISTRY_STATE]) {
    globalState[REGISTRY_STATE] = {
      registry: createEmptyPluginRegistry(),
      key: null,
    };
  }
  return globalState[REGISTRY_STATE];
})();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setActivePluginRegistry(registry: PluginRegistry, cacheKey?: string) {
  state.registry = registry;
  state.key = cacheKey ?? null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getActivePluginRegistry(): PluginRegistry | null {
  return state.registry;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function requireActivePluginRegistry(): PluginRegistry {
  if (!state.registry) {
    state.registry = createEmptyPluginRegistry();
  }
  return state.registry;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getActivePluginRegistryKey(): string | null {
  return state.key;
}
