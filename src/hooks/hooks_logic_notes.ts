/*
 * AUTO ANNOTATION
 * File: src/hooks/hooks.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export * from "./internal-hooks.js";

export type HookEventType = import("./internal-hooks.js").InternalHookEventType;
export type HookEvent = import("./internal-hooks.js").InternalHookEvent;
export type HookHandler = import("./internal-hooks.js").InternalHookHandler;

export {
  registerInternalHook as registerHook,
  unregisterInternalHook as unregisterHook,
  clearInternalHooks as clearHooks,
  getRegisteredEventKeys as getRegisteredHookEventKeys,
  triggerInternalHook as triggerHook,
  createInternalHookEvent as createHookEvent,
} from "./internal-hooks.js";
