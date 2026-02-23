# AUTOPLACEHOLDER_ANNOTATION: src/browser/resolved-config-refresh.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { createConfigIO, loadConfig } from "../config/config.js";
import { resolveBrowserConfig, resolveProfile, type ResolvedBrowserProfile } from "./config.js";
import type { BrowserServerState } from "./server-context.types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function applyResolvedConfig(
  current: BrowserServerState,
  freshResolved: BrowserServerState["resolved"],
) {
  current.resolved = freshResolved;
  for (const [name, runtime] of current.profiles) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const nextProfile = resolveProfile(freshResolved, name);
    if (nextProfile) {
      runtime.profile = nextProfile;
      continue;
    }
    if (!runtime.running) {
      current.profiles.delete(name);
    }
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function refreshResolvedBrowserConfigFromDisk(params: {
  current: BrowserServerState;
  refreshConfigFromDisk: boolean;
  mode: "cached" | "fresh";
}) {
  if (!params.refreshConfigFromDisk) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = params.mode === "fresh" ? createConfigIO().loadConfig() : loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const freshResolved = resolveBrowserConfig(cfg.browser, cfg);
  applyResolvedConfig(params.current, freshResolved);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveBrowserProfileWithHotReload(params: {
  current: BrowserServerState;
  refreshConfigFromDisk: boolean;
  name: string;
}): ResolvedBrowserProfile | null {
  refreshResolvedBrowserConfigFromDisk({
    current: params.current,
    refreshConfigFromDisk: params.refreshConfigFromDisk,
    mode: "cached",
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let profile = resolveProfile(params.current.resolved, params.name);
  if (profile) {
    return profile;
  }

  // Hot-reload: profile missing; retry with a fresh disk read without flushing the global cache.
  refreshResolvedBrowserConfigFromDisk({
    current: params.current,
    refreshConfigFromDisk: params.refreshConfigFromDisk,
    mode: "fresh",
  });
  profile = resolveProfile(params.current.resolved, params.name);
  return profile;
}
