/*
 * AUTO ANNOTATION
 * File: src/gateway/probe-auth.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveGatewayProbeAuth(params: {
  cfg: OpenClawConfig;
  mode: "local" | "remote";
  env?: NodeJS.ProcessEnv;
}): { token?: string; password?: string } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const env = params.env ?? process.env;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const authToken = params.cfg.gateway?.auth?.token;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const authPassword = params.cfg.gateway?.auth?.password;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const remote = params.cfg.gateway?.remote;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token =
    params.mode === "remote"
      ? typeof remote?.token === "string" && remote.token.trim()
        ? remote.token.trim()
        : undefined
      : env.OPENCLAW_GATEWAY_TOKEN?.trim() ||
        (typeof authToken === "string" && authToken.trim() ? authToken.trim() : undefined);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const password =
    env.OPENCLAW_GATEWAY_PASSWORD?.trim() ||
    (params.mode === "remote"
      ? typeof remote?.password === "string" && remote.password.trim()
        ? remote.password.trim()
        : undefined
      : typeof authPassword === "string" && authPassword.trim()
        ? authPassword.trim()
        : undefined);

  return { token, password };
}
