/*
 * AUTO ANNOTATION
 * File: src/gateway/control-plane-audit.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { GatewayClient } from "./server-methods/types.js";

export type ControlPlaneActor = {
  actor: string;
  deviceId: string;
  clientIp: string;
  connId: string;
};

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
export function resolveControlPlaneActor(client: GatewayClient | null): ControlPlaneActor {
  return {
    actor: normalizePart(client?.connect?.client?.id, "unknown-actor"),
    deviceId: normalizePart(client?.connect?.device?.id, "unknown-device"),
    clientIp: normalizePart(client?.clientIp, "unknown-ip"),
    connId: normalizePart(client?.connId, "unknown-conn"),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatControlPlaneActor(actor: ControlPlaneActor): string {
  return `actor=${actor.actor} device=${actor.deviceId} ip=${actor.clientIp} conn=${actor.connId}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function summarizeChangedPaths(paths: string[], maxPaths = 8): string {
  if (paths.length === 0) {
    return "<none>";
  }
  if (paths.length <= maxPaths) {
    return paths.join(",");
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const head = paths.slice(0, maxPaths).join(",");
  return `${head},+${paths.length - maxPaths} more`;
}
