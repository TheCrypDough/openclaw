/*
 * AUTO ANNOTATION
 * File: src/browser/pw-tools-core.trace.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { ensureContextState, getPageForTargetId } from "./pw-session.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function traceStartViaPlaywright(opts: {
  cdpUrl: string;
  targetId?: string;
  screenshots?: boolean;
  snapshots?: boolean;
  sources?: boolean;
}): Promise<void> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const page = await getPageForTargetId(opts);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const context = page.context();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ctxState = ensureContextState(context);
  if (ctxState.traceActive) {
    throw new Error("Trace already running. Stop the current trace before starting a new one.");
  }
  await context.tracing.start({
    screenshots: opts.screenshots ?? true,
    snapshots: opts.snapshots ?? true,
    sources: opts.sources ?? false,
  });
  ctxState.traceActive = true;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function traceStopViaPlaywright(opts: {
  cdpUrl: string;
  targetId?: string;
  path: string;
}): Promise<void> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const page = await getPageForTargetId(opts);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const context = page.context();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ctxState = ensureContextState(context);
  if (!ctxState.traceActive) {
    throw new Error("No active trace. Start a trace before stopping it.");
  }
  await context.tracing.stop({ path: opts.path });
  ctxState.traceActive = false;
}
