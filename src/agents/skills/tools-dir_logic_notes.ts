/*
 * AUTO ANNOTATION
 * File: src/agents/skills/tools-dir.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { safePathSegmentHashed } from "../../infra/install-safe-path.js";
import { resolveConfigDir } from "../../utils.js";
import { resolveSkillKey } from "./frontmatter.js";
import type { SkillEntry } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSkillToolsRootDir(entry: SkillEntry): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = resolveSkillKey(entry.skill, entry);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const safeKey = safePathSegmentHashed(key);
  return path.join(resolveConfigDir(), "tools", safeKey);
}
