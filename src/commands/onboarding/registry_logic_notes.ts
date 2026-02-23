/*
 * AUTO ANNOTATION
 * File: src/commands/onboarding/registry.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { listChannelPlugins } from "../../channels/plugins/index.js";
import type { ChannelChoice } from "../onboard-types.js";
import type { ChannelOnboardingAdapter } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const CHANNEL_ONBOARDING_ADAPTERS = () =>
  new Map<ChannelChoice, ChannelOnboardingAdapter>(
    listChannelPlugins()
      .map((plugin) => (plugin.onboarding ? ([plugin.id, plugin.onboarding] as const) : null))
      .filter((entry): entry is readonly [ChannelChoice, ChannelOnboardingAdapter] =>
        Boolean(entry),
      ),
  );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getChannelOnboardingAdapter(
  channel: ChannelChoice,
): ChannelOnboardingAdapter | undefined {
  return CHANNEL_ONBOARDING_ADAPTERS().get(channel);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function listChannelOnboardingAdapters(): ChannelOnboardingAdapter[] {
  return Array.from(CHANNEL_ONBOARDING_ADAPTERS().values());
}

// Legacy aliases (pre-rename).
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const getProviderOnboardingAdapter = getChannelOnboardingAdapter;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const listProviderOnboardingAdapters = listChannelOnboardingAdapters;
