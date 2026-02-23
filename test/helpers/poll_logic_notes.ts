/*
 * AUTO ANNOTATION
 * File: test/helpers/poll.ts
 * Purpose: Automated test for behavior validation (automated unit/e2e/live test suites).
 * Module area: Automated unit/e2e/live test suites
 * System effect: Affects confidence and CI coverage for system behavior, not production runtime by itself.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { sleep } from "../../src/utils.js";

export type PollOptions = {
  timeoutMs?: number;
  intervalMs?: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function pollUntil<T>(
  fn: () => Promise<T | null | undefined>,
  opts: PollOptions = {},
): Promise<T | undefined> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const timeoutMs = opts.timeoutMs ?? 2000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const intervalMs = opts.intervalMs ?? 25;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = await fn();
    if (value !== null && value !== undefined) {
      return value;
    }
    await sleep(intervalMs);
  }

  return undefined;
}
