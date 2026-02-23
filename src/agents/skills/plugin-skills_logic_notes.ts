/*
 * AUTO ANNOTATION
 * File: src/agents/skills/plugin-skills.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import type { OpenClawConfig } from "../../config/config.js";
import { createSubsystemLogger } from "../../logging/subsystem.js";
import {
  normalizePluginsConfig,
  resolveEnableState,
  resolveMemorySlotDecision,
} from "../../plugins/config-state.js";
import { loadPluginManifestRegistry } from "../../plugins/manifest-registry.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("skills");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolvePluginSkillDirs(params: {
  workspaceDir: string;
  config?: OpenClawConfig;
}): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const workspaceDir = params.workspaceDir.trim();
  if (!workspaceDir) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const registry = loadPluginManifestRegistry({
    workspaceDir,
    config: params.config,
  });
  if (registry.plugins.length === 0) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedPlugins = normalizePluginsConfig(params.config?.plugins);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const memorySlot = normalizedPlugins.slots.memory;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let selectedMemoryPluginId: string | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const seen = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved: string[] = [];

  for (const record of registry.plugins) {
    if (!record.skills || record.skills.length === 0) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const enableState = resolveEnableState(record.id, record.origin, normalizedPlugins);
    if (!enableState.enabled) {
      continue;
    }
    const memoryDecision = resolveMemorySlotDecision({
      id: record.id,
      kind: record.kind,
      slot: memorySlot,
      selectedId: selectedMemoryPluginId,
    });
    if (!memoryDecision.enabled) {
      continue;
    }
    if (memoryDecision.selected && record.kind === "memory") {
      selectedMemoryPluginId = record.id;
    }
    for (const raw of record.skills) {
      const trimmed = raw.trim();
      if (!trimmed) {
        continue;
      }
      const candidate = path.resolve(record.rootDir, trimmed);
      if (!fs.existsSync(candidate)) {
        log.warn(`plugin skill path not found (${record.id}): ${candidate}`);
        continue;
      }
      if (seen.has(candidate)) {
        continue;
      }
      seen.add(candidate);
      resolved.push(candidate);
    }
  }

  return resolved;
}
