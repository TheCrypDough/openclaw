/*
 * AUTO ANNOTATION
 * File: src/browser/control-service.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { loadConfig } from "../config/config.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { resolveBrowserConfig } from "./config.js";
import { ensureBrowserControlAuth } from "./control-auth.js";
import { type BrowserServerState, createBrowserRouteContext } from "./server-context.js";
import { ensureExtensionRelayForProfiles, stopKnownBrowserProfiles } from "./server-lifecycle.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let state: BrowserServerState | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("browser");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const logService = log.child("service");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getBrowserControlState(): BrowserServerState | null {
  return state;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createBrowserControlContext() {
  return createBrowserRouteContext({
    getState: () => state,
    refreshConfigFromDisk: true,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function startBrowserControlServiceFromConfig(): Promise<BrowserServerState | null> {
  if (state) {
    return state;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved = resolveBrowserConfig(cfg.browser, cfg);
  if (!resolved.enabled) {
    return null;
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ensured = await ensureBrowserControlAuth({ cfg });
    if (ensured.generatedToken) {
      logService.info("No browser auth configured; generated gateway.auth.token automatically.");
    }
  } catch (err) {
    logService.warn(`failed to auto-configure browser auth: ${String(err)}`);
  }

  state = {
    server: null,
    port: resolved.controlPort,
    resolved,
    profiles: new Map(),
  };

  await ensureExtensionRelayForProfiles({
    resolved,
    onWarn: (message) => logService.warn(message),
  });

  logService.info(
    `Browser control service ready (profiles=${Object.keys(resolved.profiles).length})`,
  );
  return state;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function stopBrowserControlService(): Promise<void> {
  const current = state;
  if (!current) {
    return;
  }

  await stopKnownBrowserProfiles({
    getState: () => state,
    onWarn: (message) => logService.warn(message),
  });

  state = null;

  // Optional: Playwright is not always available (e.g. embedded gateway builds).
  try {
    const mod = await import("./pw-ai.js");
    await mod.closePlaywrightBrowserConnection();
  } catch {
    // ignore
  }
}
