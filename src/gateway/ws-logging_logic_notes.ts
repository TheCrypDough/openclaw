/*
 * AUTO ANNOTATION
 * File: src/gateway/ws-logging.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type GatewayWsLogStyle = "auto" | "full" | "compact";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let gatewayWsLogStyle: GatewayWsLogStyle = "auto";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setGatewayWsLogStyle(style: GatewayWsLogStyle): void {
  gatewayWsLogStyle = style;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getGatewayWsLogStyle(): GatewayWsLogStyle {
  return gatewayWsLogStyle;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_WS_SLOW_MS = 50;
