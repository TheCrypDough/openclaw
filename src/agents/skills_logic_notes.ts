/*
 * AUTO ANNOTATION
 * File: src/agents/skills.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import type { SkillsInstallPreferences } from "./skills/types.js";

export {
  hasBinary,
  isBundledSkillAllowed,
  isConfigPathTruthy,
  resolveBundledAllowlist,
  resolveConfigPath,
  resolveRuntimePlatform,
  resolveSkillConfig,
} from "./skills/config.js";
export {
  applySkillEnvOverrides,
  applySkillEnvOverridesFromSnapshot,
} from "./skills/env-overrides.js";
export type {
  OpenClawSkillMetadata,
  SkillEligibilityContext,
  SkillCommandSpec,
  SkillEntry,
  SkillInstallSpec,
  SkillSnapshot,
  SkillsInstallPreferences,
} from "./skills/types.js";
export {
  buildWorkspaceSkillSnapshot,
  buildWorkspaceSkillsPrompt,
  buildWorkspaceSkillCommandSpecs,
  filterWorkspaceSkillEntries,
  loadWorkspaceSkillEntries,
  resolveSkillsPromptForRun,
  syncSkillsToWorkspace,
} from "./skills/workspace.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSkillsInstallPreferences(config?: OpenClawConfig): SkillsInstallPreferences {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = config?.skills?.install;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const preferBrew = raw?.preferBrew ?? true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const managerRaw = typeof raw?.nodeManager === "string" ? raw.nodeManager.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const manager = managerRaw.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const nodeManager: SkillsInstallPreferences["nodeManager"] =
    manager === "pnpm" || manager === "yarn" || manager === "bun" || manager === "npm"
      ? manager
      : "npm";
  return { preferBrew, nodeManager };
}
