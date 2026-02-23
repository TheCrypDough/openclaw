/*
 * AUTO ANNOTATION
 * File: test/helpers/inbound-contract-capture.ts
 * Purpose: Automated test for behavior validation (automated unit/e2e/live test suites).
 * Module area: Automated unit/e2e/live test suites
 * System effect: Affects confidence and CI coverage for system behavior, not production runtime by itself.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MsgContext } from "../../src/auto-reply/templating.js";
import { buildDispatchInboundCaptureMock } from "./dispatch-inbound-capture.js";

export type InboundContextCapture = {
  ctx: MsgContext | undefined;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createInboundContextCapture(): InboundContextCapture {
  return { ctx: undefined };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function buildDispatchInboundContextCapture(
  importOriginal: <T extends Record<string, unknown>>() => Promise<T>,
  capture: InboundContextCapture,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await importOriginal<typeof import("../../src/auto-reply/dispatch.js")>();
  return buildDispatchInboundCaptureMock(actual, (ctx) => {
    capture.ctx = ctx as MsgContext;
  });
}
