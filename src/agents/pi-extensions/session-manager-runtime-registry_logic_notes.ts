/*
 * AUTO ANNOTATION
 * File: src/agents/pi-extensions/session-manager-runtime-registry.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSessionManagerRuntimeRegistry<TValue>() {
  // Session-scoped runtime registry keyed by object identity.
  // The SessionManager instance must stay stable across set/get calls.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const registry = new WeakMap<object, TValue>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const set = (sessionManager: unknown, value: TValue | null): void => {
    if (!sessionManager || typeof sessionManager !== "object") {
      return;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const key = sessionManager;
    if (value === null) {
      registry.delete(key);
      return;
    }

    registry.set(key, value);
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const get = (sessionManager: unknown): TValue | null => {
    if (!sessionManager || typeof sessionManager !== "object") {
      return null;
    }

    return registry.get(sessionManager) ?? null;
  };

  return { set, get };
}
