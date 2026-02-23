/*
 * AUTO ANNOTATION
 * File: src/slack/monitor/commands.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { SlackSlashCommandConfig } from "../../config/config.js";

/**
 * Strip Slack mentions (<@U123>, <@U123|name>) so command detection works on
 * normalized text. Use in both prepare and debounce gate for consistency.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripSlackMentionsForCommandDetection(text: string): string {
  return (text ?? "")
    .replace(/<@[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeSlackSlashCommandName(raw: string) {
  return raw.replace(/^\/+/, "");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSlackSlashCommandConfig(
  raw?: SlackSlashCommandConfig,
): Required<SlackSlashCommandConfig> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedName = normalizeSlackSlashCommandName(raw?.name?.trim() || "openclaw");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const name = normalizedName || "openclaw";
  return {
    enabled: raw?.enabled === true,
    name,
    sessionPrefix: raw?.sessionPrefix?.trim() || "slack:slash",
    ephemeral: raw?.ephemeral !== false,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildSlackSlashCommandMatcher(name: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeSlackSlashCommandName(name);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^/?${escaped}$`);
}
