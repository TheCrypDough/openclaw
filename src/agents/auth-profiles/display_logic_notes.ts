/*
 * AUTO ANNOTATION
 * File: src/agents/auth-profiles/display.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../../config/config.js";
import type { AuthProfileStore } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveAuthProfileDisplayLabel(params: {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  profileId: string;
}): string {
  const { cfg, store, profileId } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const profile = store.profiles[profileId];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configEmail = cfg?.auth?.profiles?.[profileId]?.email?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const email = configEmail || (profile && "email" in profile ? profile.email?.trim() : undefined);
  if (email) {
    return `${profileId} (${email})`;
  }
  return profileId;
}
