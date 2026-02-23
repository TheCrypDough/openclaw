/*
 * AUTO ANNOTATION
 * File: src/commands/node-daemon-runtime.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  DEFAULT_GATEWAY_DAEMON_RUNTIME,
  GATEWAY_DAEMON_RUNTIME_OPTIONS,
  isGatewayDaemonRuntime,
  type GatewayDaemonRuntime,
} from "./daemon-runtime.js";

export type NodeDaemonRuntime = GatewayDaemonRuntime;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_NODE_DAEMON_RUNTIME = DEFAULT_GATEWAY_DAEMON_RUNTIME;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const NODE_DAEMON_RUNTIME_OPTIONS = GATEWAY_DAEMON_RUNTIME_OPTIONS;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isNodeDaemonRuntime(value: string | undefined): value is NodeDaemonRuntime {
  return isGatewayDaemonRuntime(value);
}
