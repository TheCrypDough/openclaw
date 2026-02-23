/*
 * AUTO ANNOTATION
 * File: src/discord/ui.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Container } from "@buape/carbon";
import type { OpenClawConfig } from "../config/config.js";
import { resolveDiscordAccount } from "./accounts.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_DISCORD_ACCENT_COLOR = "#5865F2";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DiscordContainerComponents = ConstructorParameters<typeof Container>[0];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ResolveDiscordAccentColorParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeDiscordAccentColor(raw?: string | null): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = (raw ?? "").trim();
  if (!trimmed) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }
  return normalized.toUpperCase();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveDiscordAccentColor(params: ResolveDiscordAccentColorParams): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveDiscordAccount({ cfg: params.cfg, accountId: params.accountId });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configured = normalizeDiscordAccentColor(account.config.ui?.components?.accentColor);
  return configured ?? DEFAULT_DISCORD_ACCENT_COLOR;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class DiscordUiContainer extends Container {
  constructor(params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    components?: DiscordContainerComponents;
    accentColor?: string;
    spoiler?: boolean;
  }) {
    const accentOverride = normalizeDiscordAccentColor(params.accentColor);
    const accentColor =
      accentOverride ?? resolveDiscordAccentColor({ cfg: params.cfg, accountId: params.accountId });
    super(params.components, { accentColor, spoiler: params.spoiler });
  }
}
