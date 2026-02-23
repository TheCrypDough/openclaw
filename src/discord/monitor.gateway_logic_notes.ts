/*
 * AUTO ANNOTATION
 * File: src/discord/monitor.gateway.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { EventEmitter } from "node:events";

export type DiscordGatewayHandle = {
  emitter?: Pick<EventEmitter, "on" | "removeListener">;
  disconnect?: () => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getDiscordGatewayEmitter(gateway?: unknown): EventEmitter | undefined {
  return (gateway as { emitter?: EventEmitter } | undefined)?.emitter;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function waitForDiscordGatewayStop(params: {
  gateway?: DiscordGatewayHandle;
  abortSignal?: AbortSignal;
  onGatewayError?: (err: unknown) => void;
  shouldStopOnError?: (err: unknown) => boolean;
}): Promise<void> {
  const { gateway, abortSignal, onGatewayError, shouldStopOnError } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const emitter = gateway?.emitter;
  return await new Promise<void>((resolve, reject) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let settled = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cleanup = () => {
      abortSignal?.removeEventListener("abort", onAbort);
      emitter?.removeListener("error", onGatewayErrorEvent);
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const finishResolve = () => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      try {
        gateway?.disconnect?.();
      } finally {
        resolve();
      }
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const finishReject = (err: unknown) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      try {
        gateway?.disconnect?.();
      } finally {
        reject(err);
      }
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onAbort = () => {
      finishResolve();
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onGatewayErrorEvent = (err: unknown) => {
      onGatewayError?.(err);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const shouldStop = shouldStopOnError?.(err) ?? true;
      if (shouldStop) {
        finishReject(err);
      }
    };

    if (abortSignal?.aborted) {
      onAbort();
      return;
    }

    abortSignal?.addEventListener("abort", onAbort, { once: true });
    emitter?.on("error", onGatewayErrorEvent);
  });
}
