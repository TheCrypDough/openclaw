/*
 * AUTO ANNOTATION
 * File: src/agents/model-alias-lines.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildModelAliasLines(cfg?: OpenClawConfig) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const models = cfg?.agents?.defaults?.models ?? {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries: Array<{ alias: string; model: string }> = [];
  for (const [keyRaw, entryRaw] of Object.entries(models)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const model = String(keyRaw ?? "").trim();
    if (!model) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const alias = String((entryRaw as { alias?: string } | undefined)?.alias ?? "").trim();
    if (!alias) {
      continue;
    }
    entries.push({ alias, model });
  }
  return entries
    .toSorted((a, b) => a.alias.localeCompare(b.alias))
    .map((entry) => `- ${entry.alias}: ${entry.model}`);
}
