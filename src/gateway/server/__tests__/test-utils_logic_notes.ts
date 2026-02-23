/*
 * AUTO ANNOTATION
 * File: src/gateway/server/__tests__/test-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createEmptyPluginRegistry, type PluginRegistry } from "../../../plugins/registry.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const createTestRegistry = (overrides: Partial<PluginRegistry> = {}): PluginRegistry => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const merged = { ...createEmptyPluginRegistry(), ...overrides };
  return {
    ...merged,
    gatewayHandlers: merged.gatewayHandlers ?? {},
    httpHandlers: merged.httpHandlers ?? [],
    httpRoutes: merged.httpRoutes ?? [],
  };
};
