/*
 * AUTO ANNOTATION
 * File: src/agents/skills/bundled-context.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { loadSkillsFromDir } from "@mariozechner/pi-coding-agent";
import { createSubsystemLogger } from "../../logging/subsystem.js";
import { resolveBundledSkillsDir, type BundledSkillsResolveOptions } from "./bundled-dir.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const skillsLogger = createSubsystemLogger("skills");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let hasWarnedMissingBundledDir = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let cachedBundledContext: { dir: string; names: Set<string> } | null = null;

export type BundledSkillsContext = {
  dir?: string;
  names: Set<string>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveBundledSkillsContext(
  opts: BundledSkillsResolveOptions = {},
): BundledSkillsContext {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = resolveBundledSkillsDir(opts);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const names = new Set<string>();
  if (!dir) {
    if (!hasWarnedMissingBundledDir) {
      hasWarnedMissingBundledDir = true;
      skillsLogger.warn(
        "Bundled skills directory could not be resolved; built-in skills may be missing.",
      );
    }
    return { dir, names };
  }

  if (cachedBundledContext?.dir === dir) {
    return { dir, names: new Set(cachedBundledContext.names) };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = loadSkillsFromDir({ dir, source: "openclaw-bundled" });
  for (const skill of result.skills) {
    if (skill.name.trim()) {
      names.add(skill.name);
    }
  }
  cachedBundledContext = { dir, names: new Set(names) };
  return { dir, names };
}
