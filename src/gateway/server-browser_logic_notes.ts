/*
 * AUTO ANNOTATION
 * File: src/gateway/server-browser.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { isTruthyEnvValue } from "../infra/env.js";

export type BrowserControlServer = {
  stop: () => Promise<void>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function startBrowserControlServerIfEnabled(): Promise<BrowserControlServer | null> {
  if (isTruthyEnvValue(process.env.OPENCLAW_SKIP_BROWSER_CONTROL_SERVER)) {
    return null;
  }
  // Lazy import: keeps startup fast, but still bundles for the embedded
  // gateway (bun --compile) via the static specifier path.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const override = process.env.OPENCLAW_BROWSER_CONTROL_MODULE?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mod = override ? await import(override) : await import("../browser/control-service.js");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const start =
    typeof (mod as { startBrowserControlServiceFromConfig?: unknown })
      .startBrowserControlServiceFromConfig === "function"
      ? (mod as { startBrowserControlServiceFromConfig: () => Promise<unknown> })
          .startBrowserControlServiceFromConfig
      : (mod as { startBrowserControlServerFromConfig?: () => Promise<unknown> })
          .startBrowserControlServerFromConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stop =
    typeof (mod as { stopBrowserControlService?: unknown }).stopBrowserControlService === "function"
      ? (mod as { stopBrowserControlService: () => Promise<void> }).stopBrowserControlService
      : (mod as { stopBrowserControlServer?: () => Promise<void> }).stopBrowserControlServer;
  if (!start) {
    return null;
  }
  await start();
  return { stop: stop ?? (async () => {}) };
}
