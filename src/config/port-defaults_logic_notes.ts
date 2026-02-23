/*
 * AUTO ANNOTATION
 * File: src/config/port-defaults.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type PortRange = { start: number; end: number };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isValidPort(port: number): boolean {
  return Number.isFinite(port) && port > 0 && port <= 65535;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function clampPort(port: number, fallback: number): number {
  return isValidPort(port) ? port : fallback;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function derivePort(base: number, offset: number, fallback: number): number {
  return clampPort(base + offset, fallback);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_BRIDGE_PORT = 18790;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_BROWSER_CONTROL_PORT = 18791;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_CANVAS_HOST_PORT = 18793;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_BROWSER_CDP_PORT_RANGE_START = 18800;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_BROWSER_CDP_PORT_RANGE_END = 18899;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function deriveDefaultBridgePort(gatewayPort: number): number {
  return derivePort(gatewayPort, 1, DEFAULT_BRIDGE_PORT);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function deriveDefaultBrowserControlPort(gatewayPort: number): number {
  return derivePort(gatewayPort, 2, DEFAULT_BROWSER_CONTROL_PORT);
}

export function deriveDefaultCanvasHostPort(gatewayPort: number): number {
  return derivePort(gatewayPort, 4, DEFAULT_CANVAS_HOST_PORT);
}

export function deriveDefaultBrowserCdpPortRange(browserControlPort: number): PortRange {
  const start = derivePort(browserControlPort, 9, DEFAULT_BROWSER_CDP_PORT_RANGE_START);
  const end = clampPort(
    start + (DEFAULT_BROWSER_CDP_PORT_RANGE_END - DEFAULT_BROWSER_CDP_PORT_RANGE_START),
    DEFAULT_BROWSER_CDP_PORT_RANGE_END,
  );
  if (end < start) {
    return { start, end: start };
  }
  return { start, end };
}
