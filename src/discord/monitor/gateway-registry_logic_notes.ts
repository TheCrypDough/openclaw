/*
 * AUTO ANNOTATION
 * File: src/discord/monitor/gateway-registry.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { GatewayPlugin } from "@buape/carbon/gateway";

/**
 * Module-level registry of active Discord GatewayPlugin instances.
 * Bridges the gap between agent tool handlers (which only have REST access)
 * and the gateway WebSocket (needed for operations like updatePresence).
 * Follows the same pattern as presence-cache.ts.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const gatewayRegistry = new Map<string, GatewayPlugin>();

// Sentinel key for the default (unnamed) account. Uses a prefix that cannot
// collide with user-configured account IDs.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_ACCOUNT_KEY = "\0__default__";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAccountKey(accountId?: string): string {
  return accountId ?? DEFAULT_ACCOUNT_KEY;
}

/** Register a GatewayPlugin instance for an account. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerGateway(accountId: string | undefined, gateway: GatewayPlugin): void {
  gatewayRegistry.set(resolveAccountKey(accountId), gateway);
}

/** Unregister a GatewayPlugin instance for an account. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function unregisterGateway(accountId?: string): void {
  gatewayRegistry.delete(resolveAccountKey(accountId));
}

/** Get the GatewayPlugin for an account. Returns undefined if not registered. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getGateway(accountId?: string): GatewayPlugin | undefined {
  return gatewayRegistry.get(resolveAccountKey(accountId));
}

/** Clear all registered gateways (for testing). */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function clearGateways(): void {
  gatewayRegistry.clear();
}
