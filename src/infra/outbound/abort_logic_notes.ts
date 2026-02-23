/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/abort.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Utility for checking AbortSignal state and throwing a standard AbortError.
 */

/**
 * Throws an AbortError if the given signal has been aborted.
 * Use at async checkpoints to support cancellation.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function throwIfAborted(abortSignal?: AbortSignal): void {
  if (abortSignal?.aborted) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const err = new Error("Operation aborted");
    err.name = "AbortError";
    throw err;
  }
}
