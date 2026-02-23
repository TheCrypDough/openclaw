/*
 * AUTO ANNOTATION
 * File: src/config/markdown-tables.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeChannelId } from "../channels/plugins/index.js";
import { normalizeAccountId } from "../routing/session-key.js";
import type { OpenClawConfig } from "./config.js";
import type { MarkdownTableMode } from "./types.base.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MarkdownConfigEntry = {
  markdown?: {
    tables?: MarkdownTableMode;
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MarkdownConfigSection = MarkdownConfigEntry & {
  accounts?: Record<string, MarkdownConfigEntry>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_TABLE_MODES = new Map<string, MarkdownTableMode>([
  ["signal", "bullets"],
  ["whatsapp", "bullets"],
]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const isMarkdownTableMode = (value: unknown): value is MarkdownTableMode =>
  value === "off" || value === "bullets" || value === "code";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveMarkdownModeFromSection(
  section: MarkdownConfigSection | undefined,
  accountId?: string | null,
): MarkdownTableMode | undefined {
  if (!section) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedAccountId = normalizeAccountId(accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accounts = section.accounts;
  if (accounts && typeof accounts === "object") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const direct = accounts[normalizedAccountId];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const directMode = direct?.markdown?.tables;
    if (isMarkdownTableMode(directMode)) {
      return directMode;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const matchKey = Object.keys(accounts).find(
      (key) => key.toLowerCase() === normalizedAccountId.toLowerCase(),
    );
    const match = matchKey ? accounts[matchKey] : undefined;
    const matchMode = match?.markdown?.tables;
    if (isMarkdownTableMode(matchMode)) {
      return matchMode;
    }
  }
  const sectionMode = section.markdown?.tables;
  return isMarkdownTableMode(sectionMode) ? sectionMode : undefined;
}

export function resolveMarkdownTableMode(params: {
  cfg?: Partial<OpenClawConfig>;
  channel?: string | null;
  accountId?: string | null;
}): MarkdownTableMode {
  const channel = normalizeChannelId(params.channel);
  const defaultMode = channel ? (DEFAULT_TABLE_MODES.get(channel) ?? "code") : "code";
  if (!channel || !params.cfg) {
    return defaultMode;
  }
  const channelsConfig = params.cfg.channels as Record<string, unknown> | undefined;
  const section = (channelsConfig?.[channel] ??
    (params.cfg as Record<string, unknown> | undefined)?.[channel]) as
    | MarkdownConfigSection
    | undefined;
  return resolveMarkdownModeFromSection(section, params.accountId) ?? defaultMode;
}
