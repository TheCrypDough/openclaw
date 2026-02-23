/*
 * AUTO ANNOTATION
 * File: src/infra/fixed-window-rate-limit.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type FixedWindowRateLimiter = {
  consume: () => {
    allowed: boolean;
    retryAfterMs: number;
    remaining: number;
  };
  reset: () => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createFixedWindowRateLimiter(params: {
  maxRequests: number;
  windowMs: number;
  now?: () => number;
}): FixedWindowRateLimiter {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxRequests = Math.max(1, Math.floor(params.maxRequests));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const windowMs = Math.max(1, Math.floor(params.windowMs));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = params.now ?? Date.now;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let count = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let windowStartMs = 0;

  return {
    consume() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const nowMs = now();
      if (nowMs - windowStartMs >= windowMs) {
        windowStartMs = nowMs;
        count = 0;
      }
      if (count >= maxRequests) {
        return {
          allowed: false,
          retryAfterMs: Math.max(0, windowStartMs + windowMs - nowMs),
          remaining: 0,
        };
      }
      count += 1;
      return {
        allowed: true,
        retryAfterMs: 0,
        remaining: Math.max(0, maxRequests - count),
      };
    },
    reset() {
      count = 0;
      windowStartMs = 0;
    },
  };
}
