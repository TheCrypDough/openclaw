/*
 * AUTO ANNOTATION
 * File: src/commands/daemon-runtime.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type GatewayDaemonRuntime = "node" | "bun";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_GATEWAY_DAEMON_RUNTIME: GatewayDaemonRuntime = "node";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const GATEWAY_DAEMON_RUNTIME_OPTIONS: Array<{
  value: GatewayDaemonRuntime;
  label: string;
  hint?: string;
}> = [
  {
    value: "node",
    label: "Node (recommended)",
    hint: "Required for WhatsApp + Telegram. Bun can corrupt memory on reconnect.",
  },
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isGatewayDaemonRuntime(value: string | undefined): value is GatewayDaemonRuntime {
  return value === "node" || value === "bun";
}
