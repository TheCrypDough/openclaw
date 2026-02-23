/*
 * AUTO ANNOTATION
 * File: src/commands/status.gateway-probe.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { loadConfig } from "../config/config.js";
export { pickGatewaySelfPresence } from "./gateway-presence.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveGatewayProbeAuth(cfg: ReturnType<typeof loadConfig>): {
  token?: string;
  password?: string;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isRemoteMode = cfg.gateway?.mode === "remote";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const remote = isRemoteMode ? cfg.gateway?.remote : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const authToken = cfg.gateway?.auth?.token;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const authPassword = cfg.gateway?.auth?.password;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = isRemoteMode
    ? typeof remote?.token === "string" && remote.token.trim().length > 0
      ? remote.token.trim()
      : undefined
    : process.env.OPENCLAW_GATEWAY_TOKEN?.trim() ||
      (typeof authToken === "string" && authToken.trim().length > 0 ? authToken.trim() : undefined);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const password =
    process.env.OPENCLAW_GATEWAY_PASSWORD?.trim() ||
    (isRemoteMode
      ? typeof remote?.password === "string" && remote.password.trim().length > 0
        ? remote.password.trim()
        : undefined
      : typeof authPassword === "string" && authPassword.trim().length > 0
        ? authPassword.trim()
        : undefined);
  return { token, password };
}
