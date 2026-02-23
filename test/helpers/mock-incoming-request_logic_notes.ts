/*
 * AUTO ANNOTATION
 * File: test/helpers/mock-incoming-request.ts
 * Purpose: Automated test for behavior validation (automated unit/e2e/live test suites).
 * Module area: Automated unit/e2e/live test suites
 * System effect: Affects confidence and CI coverage for system behavior, not production runtime by itself.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { EventEmitter } from "node:events";
import type { IncomingMessage } from "node:http";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createMockIncomingRequest(chunks: string[]): IncomingMessage {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const req = new EventEmitter() as IncomingMessage & {
    destroyed?: boolean;
    destroy: (error?: Error) => IncomingMessage;
  };
  req.destroyed = false;
  req.headers = {};
  req.destroy = () => {
    req.destroyed = true;
    return req;
  };

  void Promise.resolve().then(() => {
    for (const chunk of chunks) {
      req.emit("data", Buffer.from(chunk, "utf-8"));
      if (req.destroyed) {
        return;
      }
    }
    req.emit("end");
  });

  return req;
}
