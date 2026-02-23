/*
 * AUTO ANNOTATION
 * File: src/agents/pi-tools.abort.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { bindAbortRelay } from "../utils/fetch-timeout.js";
import type { AnyAgentTool } from "./pi-tools.types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function throwAbortError(): never {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const err = new Error("Aborted");
  err.name = "AbortError";
  throw err;
}

/**
 * Checks if an object is a valid AbortSignal using structural typing.
 * This is more reliable than `instanceof` across different realms (VM, iframe, etc.)
 * where the AbortSignal constructor may differ.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isAbortSignal(obj: unknown): obj is AbortSignal {
  return obj instanceof AbortSignal;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function combineAbortSignals(a?: AbortSignal, b?: AbortSignal): AbortSignal | undefined {
  if (!a && !b) {
    return undefined;
  }
  if (a && !b) {
    return a;
  }
  if (b && !a) {
    return b;
  }
  if (a?.aborted) {
    return a;
  }
  if (b?.aborted) {
    return b;
  }
  if (typeof AbortSignal.any === "function" && isAbortSignal(a) && isAbortSignal(b)) {
    return AbortSignal.any([a, b]);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const controller = new AbortController();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const onAbort = bindAbortRelay(controller);
  a?.addEventListener("abort", onAbort, { once: true });
  b?.addEventListener("abort", onAbort, { once: true });
  return controller.signal;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function wrapToolWithAbortSignal(
  tool: AnyAgentTool,
  abortSignal?: AbortSignal,
): AnyAgentTool {
  if (!abortSignal) {
    return tool;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const execute = tool.execute;
  if (!execute) {
    return tool;
  }
  return {
    ...tool,
    execute: async (toolCallId, params, signal, onUpdate) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const combined = combineAbortSignals(signal, abortSignal);
      if (combined?.aborted) {
        throwAbortError();
      }
      return await execute(toolCallId, params, combined, onUpdate);
    },
  };
}
