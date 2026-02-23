/*
 * AUTO ANNOTATION
 * File: src/gateway/server-mobile-nodes.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { NodeRegistry } from "./node-registry.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const isMobilePlatform = (platform: unknown): boolean => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const p = typeof platform === "string" ? platform.trim().toLowerCase() : "";
  if (!p) {
    return false;
  }
  return p.startsWith("ios") || p.startsWith("ipados") || p.startsWith("android");
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function hasConnectedMobileNode(registry: NodeRegistry): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const connected = registry.listConnected();
  return connected.some((n) => isMobilePlatform(n.platform));
}
