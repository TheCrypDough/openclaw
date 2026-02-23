/*
 * AUTO ANNOTATION
 * File: test/helpers/dispatch-inbound-capture.ts
 * Purpose: Automated test for behavior validation (automated unit/e2e/live test suites).
 * Module area: Automated unit/e2e/live test suites
 * System effect: Affects confidence and CI coverage for system behavior, not production runtime by itself.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildDispatchInboundCaptureMock<T extends Record<string, unknown>>(
  actual: T,
  setCtx: (ctx: unknown) => void,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dispatchInboundMessage = vi.fn(async (params: { ctx: unknown }) => {
    setCtx(params.ctx);
    return { queuedFinal: false, counts: { tool: 0, block: 0, final: 0 } };
  });

  return {
    ...actual,
    dispatchInboundMessage,
    dispatchInboundMessageWithDispatcher: dispatchInboundMessage,
    dispatchInboundMessageWithBufferedDispatcher: dispatchInboundMessage,
  };
}
