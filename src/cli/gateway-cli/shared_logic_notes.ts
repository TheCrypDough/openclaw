/*
 * AUTO ANNOTATION
 * File: src/cli/gateway-cli/shared.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  resolveGatewayLaunchAgentLabel,
  resolveGatewaySystemdServiceName,
  resolveGatewayWindowsTaskName,
} from "../../daemon/constants.js";
import { resolveGatewayService } from "../../daemon/service.js";
import { defaultRuntime } from "../../runtime.js";
import { formatCliCommand } from "../command-format.js";
import { parsePort } from "../shared/parse-port.js";

export { parsePort };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const toOptionString = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return value.toString();
  }
  return undefined;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function describeUnknownError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "string") {
    return err;
  }
  if (typeof err === "number" || typeof err === "bigint") {
    return err.toString();
  }
  if (typeof err === "boolean") {
    return err ? "true" : "false";
  }
  if (err && typeof err === "object") {
    if ("message" in err && typeof err.message === "string") {
      return err.message;
    }
    try {
      return JSON.stringify(err);
    } catch {
      return "Unknown error";
    }
  }
  return "Unknown error";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractGatewayMiskeys(parsed: unknown): {
  hasGatewayToken: boolean;
  hasRemoteToken: boolean;
} {
  if (!parsed || typeof parsed !== "object") {
    return { hasGatewayToken: false, hasRemoteToken: false };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const gateway = (parsed as Record<string, unknown>).gateway;
  if (!gateway || typeof gateway !== "object") {
    return { hasGatewayToken: false, hasRemoteToken: false };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasGatewayToken = "token" in (gateway as Record<string, unknown>);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const remote = (gateway as Record<string, unknown>).remote;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasRemoteToken =
    remote && typeof remote === "object" ? "token" in (remote as Record<string, unknown>) : false;
  return { hasGatewayToken, hasRemoteToken };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function renderGatewayServiceStopHints(env: NodeJS.ProcessEnv = process.env): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const profile = env.OPENCLAW_PROFILE;
  switch (process.platform) {
    case "darwin":
      return [
        `Tip: ${formatCliCommand("openclaw gateway stop")}`,
        `Or: launchctl bootout gui/$UID/${resolveGatewayLaunchAgentLabel(profile)}`,
      ];
    case "linux":
      return [
        `Tip: ${formatCliCommand("openclaw gateway stop")}`,
        `Or: systemctl --user stop ${resolveGatewaySystemdServiceName(profile)}.service`,
      ];
    case "win32":
      return [
        `Tip: ${formatCliCommand("openclaw gateway stop")}`,
        `Or: schtasks /End /TN "${resolveGatewayWindowsTaskName(profile)}"`,
      ];
    default:
      return [`Tip: ${formatCliCommand("openclaw gateway stop")}`];
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function maybeExplainGatewayServiceStop() {
  const service = resolveGatewayService();
  let loaded: boolean | null = null;
  try {
    loaded = await service.isLoaded({ env: process.env });
  } catch {
    loaded = null;
  }
  if (loaded === false) {
    return;
  }
  defaultRuntime.error(
    loaded
      ? `Gateway service appears ${service.loadedText}. Stop it first.`
      : "Gateway service status unknown; if supervised, stop it first.",
  );
  for (const hint of renderGatewayServiceStopHints()) {
    defaultRuntime.error(hint);
  }
}
