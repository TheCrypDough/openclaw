/*
 * AUTO ANNOTATION
 * File: src/browser/server-lifecycle.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ResolvedBrowserConfig } from "./config.js";
import { resolveProfile } from "./config.js";
import { ensureChromeExtensionRelayServer } from "./extension-relay.js";
import {
  type BrowserServerState,
  createBrowserRouteContext,
  listKnownProfileNames,
} from "./server-context.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function ensureExtensionRelayForProfiles(params: {
  resolved: ResolvedBrowserConfig;
  onWarn: (message: string) => void;
}) {
  for (const name of Object.keys(params.resolved.profiles)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const profile = resolveProfile(params.resolved, name);
    if (!profile || profile.driver !== "extension") {
      continue;
    }
    await ensureChromeExtensionRelayServer({ cdpUrl: profile.cdpUrl }).catch((err) => {
      params.onWarn(`Chrome extension relay init failed for profile "${name}": ${String(err)}`);
    });
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function stopKnownBrowserProfiles(params: {
  getState: () => BrowserServerState | null;
  onWarn: (message: string) => void;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const current = params.getState();
  if (!current) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ctx = createBrowserRouteContext({
    getState: params.getState,
    refreshConfigFromDisk: true,
  });
  try {
    for (const name of listKnownProfileNames(current)) {
      try {
        await ctx.forProfile(name).stopRunningBrowser();
      } catch {
        // ignore
      }
    }
  } catch (err) {
    params.onWarn(`openclaw browser stop failed: ${String(err)}`);
  }
}
