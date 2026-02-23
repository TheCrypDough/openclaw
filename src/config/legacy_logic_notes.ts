/*
 * AUTO ANNOTATION
 * File: src/config/legacy.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { LEGACY_CONFIG_MIGRATIONS } from "./legacy.migrations.js";
import { LEGACY_CONFIG_RULES } from "./legacy.rules.js";
import type { LegacyConfigIssue } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function findLegacyConfigIssues(raw: unknown): LegacyConfigIssue[] {
  if (!raw || typeof raw !== "object") {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const root = raw as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const issues: LegacyConfigIssue[] = [];
  for (const rule of LEGACY_CONFIG_RULES) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let cursor: unknown = root;
    for (const key of rule.path) {
      if (!cursor || typeof cursor !== "object") {
        cursor = undefined;
        break;
      }
      cursor = (cursor as Record<string, unknown>)[key];
    }
    if (cursor !== undefined && (!rule.match || rule.match(cursor, root))) {
      issues.push({ path: rule.path.join("."), message: rule.message });
    }
  }
  return issues;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyLegacyMigrations(raw: unknown): {
  next: Record<string, unknown> | null;
  changes: string[];
} {
  if (!raw || typeof raw !== "object") {
    return { next: null, changes: [] };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const next = structuredClone(raw) as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const changes: string[] = [];
  for (const migration of LEGACY_CONFIG_MIGRATIONS) {
    migration.apply(next, changes);
  }
  if (changes.length === 0) {
    return { next: null, changes: [] };
  }
  return { next, changes };
}
