/*
 * AUTO ANNOTATION
 * File: src/browser/control-auth.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import { loadConfig } from "../config/config.js";
import { resolveGatewayAuth } from "../gateway/auth.js";
import { ensureGatewayStartupAuth } from "../gateway/startup-auth.js";

export type BrowserControlAuth = {
  token?: string;
  password?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveBrowserControlAuth(
  cfg: OpenClawConfig | undefined,
  env: NodeJS.ProcessEnv = process.env,
): BrowserControlAuth {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const auth = resolveGatewayAuth({
    authConfig: cfg?.gateway?.auth,
    env,
    tailscaleMode: cfg?.gateway?.tailscale?.mode,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = typeof auth.token === "string" ? auth.token.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const password = typeof auth.password === "string" ? auth.password.trim() : "";
  return {
    token: token || undefined,
    password: password || undefined,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function shouldAutoGenerateBrowserAuth(env: NodeJS.ProcessEnv): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const nodeEnv = (env.NODE_ENV ?? "").trim().toLowerCase();
  if (nodeEnv === "test") {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const vitest = (env.VITEST ?? "").trim().toLowerCase();
  if (vitest && vitest !== "0" && vitest !== "false" && vitest !== "off") {
    return false;
  }
  return true;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function ensureBrowserControlAuth(params: {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
}): Promise<{
  auth: BrowserControlAuth;
  generatedToken?: string;
}> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const env = params.env ?? process.env;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const auth = resolveBrowserControlAuth(params.cfg, env);
  if (auth.token || auth.password) {
    return { auth };
  }
  if (!shouldAutoGenerateBrowserAuth(env)) {
    return { auth };
  }

  // Respect explicit password mode even if currently unset.
  if (params.cfg.gateway?.auth?.mode === "password") {
    return { auth };
  }

  if (params.cfg.gateway?.auth?.mode === "none") {
    return { auth };
  }

  if (params.cfg.gateway?.auth?.mode === "trusted-proxy") {
    return { auth };
  }

  // Re-read latest config to avoid racing with concurrent config writers.
  const latestCfg = loadConfig();
  const latestAuth = resolveBrowserControlAuth(latestCfg, env);
  if (latestAuth.token || latestAuth.password) {
    return { auth: latestAuth };
  }
  if (latestCfg.gateway?.auth?.mode === "password") {
    return { auth: latestAuth };
  }
  if (latestCfg.gateway?.auth?.mode === "none") {
    return { auth: latestAuth };
  }
  if (latestCfg.gateway?.auth?.mode === "trusted-proxy") {
    return { auth: latestAuth };
  }

  const ensured = await ensureGatewayStartupAuth({
    cfg: latestCfg,
    env,
    persist: true,
  });
  const ensuredAuth = resolveBrowserControlAuth(ensured.cfg, env);
  return {
    auth: ensuredAuth,
    generatedToken: ensured.generatedToken,
  };
}
