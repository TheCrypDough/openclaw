/*
 * AUTO ANNOTATION
 * File: src/gateway/control-plane-rate-limit.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { GatewayClient } from "./server-methods/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CONTROL_PLANE_RATE_LIMIT_MAX_REQUESTS = 3;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CONTROL_PLANE_RATE_LIMIT_WINDOW_MS = 60_000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type Bucket = {
  count: number;
  windowStartMs: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const controlPlaneBuckets = new Map<string, Bucket>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizePart(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveControlPlaneRateLimitKey(client: GatewayClient | null): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const deviceId = normalizePart(client?.connect?.device?.id, "unknown-device");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const clientIp = normalizePart(client?.clientIp, "unknown-ip");
  return `${deviceId}|${clientIp}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function consumeControlPlaneWriteBudget(params: {
  client: GatewayClient | null;
  nowMs?: number;
}): {
  allowed: boolean;
  retryAfterMs: number;
  remaining: number;
  key: string;
} {
  const nowMs = params.nowMs ?? Date.now();
  const key = resolveControlPlaneRateLimitKey(params.client);
  const bucket = controlPlaneBuckets.get(key);

  if (!bucket || nowMs - bucket.windowStartMs >= CONTROL_PLANE_RATE_LIMIT_WINDOW_MS) {
    controlPlaneBuckets.set(key, {
      count: 1,
      windowStartMs: nowMs,
    });
    return {
      allowed: true,
      retryAfterMs: 0,
      remaining: CONTROL_PLANE_RATE_LIMIT_MAX_REQUESTS - 1,
      key,
    };
  }

  if (bucket.count >= CONTROL_PLANE_RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterMs = Math.max(
      0,
      bucket.windowStartMs + CONTROL_PLANE_RATE_LIMIT_WINDOW_MS - nowMs,
    );
    return {
      allowed: false,
      retryAfterMs,
      remaining: 0,
      key,
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    retryAfterMs: 0,
    remaining: Math.max(0, CONTROL_PLANE_RATE_LIMIT_MAX_REQUESTS - bucket.count),
    key,
  };
}

export const __testing = {
  resetControlPlaneRateLimitState() {
    controlPlaneBuckets.clear();
  },
};
