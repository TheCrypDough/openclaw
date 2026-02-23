/*
 * AUTO ANNOTATION
 * File: src/agents/pi-extensions/context-pruning/runtime.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createSessionManagerRuntimeRegistry } from "../session-manager-runtime-registry.js";
import type { EffectiveContextPruningSettings } from "./settings.js";

export type ContextPruningRuntimeValue = {
  settings: EffectiveContextPruningSettings;
  contextWindowTokens?: number | null;
  isToolPrunable: (toolName: string) => boolean;
  lastCacheTouchAt?: number | null;
};

// Important: this relies on Pi passing the same SessionManager object instance into
// ExtensionContext (ctx.sessionManager) that we used when calling setContextPruningRuntime.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const registry = createSessionManagerRuntimeRegistry<ContextPruningRuntimeValue>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const setContextPruningRuntime = registry.set;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const getContextPruningRuntime = registry.get;
