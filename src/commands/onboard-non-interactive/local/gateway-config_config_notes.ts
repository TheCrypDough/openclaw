# AUTOPLACEHOLDER_ANNOTATION: src/commands/onboard-non-interactive/local/gateway-config.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import type { OpenClawConfig } from "../../../config/config.js";
import type { RuntimeEnv } from "../../../runtime.js";
import { randomToken } from "../../onboard-helpers.js";
import type { OnboardOptions } from "../../onboard-types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyNonInteractiveGatewayConfig(params: {
  nextConfig: OpenClawConfig;
  opts: OnboardOptions;
  runtime: RuntimeEnv;
  defaultPort: number;
}): {
  nextConfig: OpenClawConfig;
  port: number;
  bind: string;
  authMode: string;
  tailscaleMode: string;
  tailscaleResetOnExit: boolean;
  gatewayToken?: string;
} | null {
  const { opts, runtime } = params;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasGatewayPort = opts.gatewayPort !== undefined;
  if (hasGatewayPort && (!Number.isFinite(opts.gatewayPort) || (opts.gatewayPort ?? 0) <= 0)) {
    runtime.error("Invalid --gateway-port");
    runtime.exit(1);
    return null;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const port = hasGatewayPort ? (opts.gatewayPort as number) : params.defaultPort;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let bind = opts.gatewayBind ?? "loopback";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const authModeRaw = opts.gatewayAuth ?? "token";
  if (authModeRaw !== "token" && authModeRaw !== "password") {
    runtime.error("Invalid --gateway-auth (use token|password).");
    runtime.exit(1);
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let authMode = authModeRaw;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tailscaleMode = opts.tailscale ?? "off";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tailscaleResetOnExit = Boolean(opts.tailscaleResetOnExit);

  // Tighten config to safe combos:
  // - If Tailscale is on, force loopback bind (the tunnel handles external access).
  // - If using Tailscale Funnel, require password auth.
  if (tailscaleMode !== "off" && bind !== "loopback") {
    bind = "loopback";
  }
  if (tailscaleMode === "funnel" && authMode !== "password") {
    authMode = "password";
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let nextConfig = params.nextConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let gatewayToken = opts.gatewayToken?.trim() || undefined;

  if (authMode === "token") {
    if (!gatewayToken) {
      gatewayToken = randomToken();
    }
    nextConfig = {
      ...nextConfig,
      gateway: {
        ...nextConfig.gateway,
        auth: {
          ...nextConfig.gateway?.auth,
          mode: "token",
          token: gatewayToken,
        },
      },
    };
  }

  if (authMode === "password") {
    const password = opts.gatewayPassword?.trim();
    if (!password) {
      runtime.error("Missing --gateway-password for password auth.");
      runtime.exit(1);
      return null;
    }
    nextConfig = {
      ...nextConfig,
      gateway: {
        ...nextConfig.gateway,
        auth: {
          ...nextConfig.gateway?.auth,
          mode: "password",
          password,
        },
      },
    };
  }

  nextConfig = {
    ...nextConfig,
    gateway: {
      ...nextConfig.gateway,
      port,
      bind,
      tailscale: {
        ...nextConfig.gateway?.tailscale,
        mode: tailscaleMode,
        resetOnExit: tailscaleResetOnExit,
      },
    },
  };

  return {
    nextConfig,
    port,
    bind,
    authMode,
    tailscaleMode,
    tailscaleResetOnExit,
    gatewayToken,
  };
}
