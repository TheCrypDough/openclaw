/*
 * AUTO ANNOTATION
 * File: src/config/channel-capabilities.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeChannelId } from "../channels/plugins/index.js";
import { normalizeAccountId } from "../routing/session-key.js";
import type { OpenClawConfig } from "./config.js";
import type { TelegramCapabilitiesConfig } from "./types.telegram.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type CapabilitiesConfig = TelegramCapabilitiesConfig;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "string");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeCapabilities(capabilities: CapabilitiesConfig | undefined): string[] | undefined {
  // Handle object-format capabilities (e.g., { inlineButtons: "dm" }) gracefully.
  // Channel-specific handlers (like resolveTelegramInlineButtonsScope) process these separately.
  if (!isStringArray(capabilities)) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = capabilities.map((entry) => entry.trim()).filter(Boolean);
  return normalized.length > 0 ? normalized : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAccountCapabilities(params: {
  cfg?: { accounts?: Record<string, { capabilities?: CapabilitiesConfig }> } & {
    capabilities?: CapabilitiesConfig;
  };
  accountId?: string | null;
}): string[] | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = params.cfg;
  if (!cfg) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedAccountId = normalizeAccountId(params.accountId);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accounts = cfg.accounts;
  if (accounts && typeof accounts === "object") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const direct = accounts[normalizedAccountId];
    if (direct) {
      return normalizeCapabilities(direct.capabilities) ?? normalizeCapabilities(cfg.capabilities);
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const matchKey = Object.keys(accounts).find(
      (key) => key.toLowerCase() === normalizedAccountId.toLowerCase(),
    );
    const match = matchKey ? accounts[matchKey] : undefined;
    if (match) {
      return normalizeCapabilities(match.capabilities) ?? normalizeCapabilities(cfg.capabilities);
    }
  }

  return normalizeCapabilities(cfg.capabilities);
}

export function resolveChannelCapabilities(params: {
  cfg?: Partial<OpenClawConfig>;
  channel?: string | null;
  accountId?: string | null;
}): string[] | undefined {
  const cfg = params.cfg;
  const channel = normalizeChannelId(params.channel);
  if (!cfg || !channel) {
    return undefined;
  }

  const channelsConfig = cfg.channels as Record<string, unknown> | undefined;
  const channelConfig = (channelsConfig?.[channel] ?? (cfg as Record<string, unknown>)[channel]) as
    | {
        accounts?: Record<string, { capabilities?: CapabilitiesConfig }>;
        capabilities?: CapabilitiesConfig;
      }
    | undefined;
  return resolveAccountCapabilities({
    cfg: channelConfig,
    accountId: params.accountId,
  });
}
