/*
 * AUTO ANNOTATION
 * File: src/commands/status.daemon.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveNodeService } from "../daemon/node-service.js";
import type { GatewayService } from "../daemon/service.js";
import { resolveGatewayService } from "../daemon/service.js";
import { formatDaemonRuntimeShort } from "./status.format.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DaemonStatusSummary = {
  label: string;
  installed: boolean | null;
  loadedText: string;
  runtimeShort: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function buildDaemonStatusSummary(
  service: GatewayService,
  fallbackLabel: string,
): Promise<DaemonStatusSummary> {
  try {
    const [loaded, runtime, command] = await Promise.all([
      service.isLoaded({ env: process.env }).catch(() => false),
      service.readRuntime(process.env).catch(() => undefined),
      service.readCommand(process.env).catch(() => null),
    ]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const installed = command != null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const loadedText = loaded ? service.loadedText : service.notLoadedText;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runtimeShort = formatDaemonRuntimeShort(runtime);
    return { label: service.label, installed, loadedText, runtimeShort };
  } catch {
    return {
      label: fallbackLabel,
      installed: null,
      loadedText: "unknown",
      runtimeShort: null,
    };
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function getDaemonStatusSummary(): Promise<DaemonStatusSummary> {
  return await buildDaemonStatusSummary(resolveGatewayService(), "Daemon");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function getNodeDaemonStatusSummary(): Promise<DaemonStatusSummary> {
  return await buildDaemonStatusSummary(resolveNodeService(), "Node");
}
