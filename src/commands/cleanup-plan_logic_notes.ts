/*
 * AUTO ANNOTATION
 * File: src/commands/cleanup-plan.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import {
  loadConfig,
  resolveConfigPath,
  resolveOAuthDir,
  resolveStateDir,
} from "../config/config.js";
import { buildCleanupPlan } from "./cleanup-utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveCleanupPlanFromDisk(): {
  cfg: OpenClawConfig;
  stateDir: string;
  configPath: string;
  oauthDir: string;
  configInsideState: boolean;
  oauthInsideState: boolean;
  workspaceDirs: string[];
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stateDir = resolveStateDir();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configPath = resolveConfigPath();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const oauthDir = resolveOAuthDir();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const plan = buildCleanupPlan({ cfg, stateDir, configPath, oauthDir });
  return { cfg, stateDir, configPath, oauthDir, ...plan };
}
