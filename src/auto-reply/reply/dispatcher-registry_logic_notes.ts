/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/dispatcher-registry.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Global registry for tracking active reply dispatchers.
 * Used to ensure gateway restart waits for all replies to complete.
 */

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type TrackedDispatcher = {
  readonly id: string;
  readonly pending: () => number;
  readonly waitForIdle: () => Promise<void>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const activeDispatchers = new Set<TrackedDispatcher>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let nextId = 0;

/**
 * Register a reply dispatcher for global tracking.
 * Returns an unregister function to call when the dispatcher is no longer needed.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerDispatcher(dispatcher: {
  readonly pending: () => number;
  readonly waitForIdle: () => Promise<void>;
}): { id: string; unregister: () => void } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const id = `dispatcher-${++nextId}`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tracked: TrackedDispatcher = {
    id,
    pending: dispatcher.pending,
    waitForIdle: dispatcher.waitForIdle,
  };
  activeDispatchers.add(tracked);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const unregister = () => {
    activeDispatchers.delete(tracked);
  };

  return { id, unregister };
}

/**
 * Get the total number of pending replies across all dispatchers.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getTotalPendingReplies(): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let total = 0;
  for (const dispatcher of activeDispatchers) {
    total += dispatcher.pending();
  }
  return total;
}

/**
 * Clear all registered dispatchers (for testing).
 * WARNING: Only use this in test cleanup!
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function clearAllDispatchers(): void {
  if (!process.env.VITEST && process.env.NODE_ENV !== "test") {
    throw new Error("clearAllDispatchers() is only available in test environments");
  }
  activeDispatchers.clear();
}
