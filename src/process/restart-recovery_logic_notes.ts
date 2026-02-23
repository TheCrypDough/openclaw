/*
 * AUTO ANNOTATION
 * File: src/process/restart-recovery.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Returns an iteration hook for in-process restart loops.
 * The first call is considered initial startup and does nothing.
 * Each subsequent call represents a restart iteration and invokes `onRestart`.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createRestartIterationHook(onRestart: () => void): () => boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let isFirstIteration = true;
  return () => {
    if (isFirstIteration) {
      isFirstIteration = false;
      return false;
    }
    onRestart();
    return true;
  };
}
