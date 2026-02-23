/*
 * AUTO ANNOTATION
 * File: src/agents/skills/bundled-dir.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveOpenClawPackageRootSync } from "../../infra/openclaw-root.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function looksLikeSkillsDir(dir: string): boolean {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) {
        continue;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const fullPath = path.join(dir, entry.name);
      if (entry.isFile() && entry.name.endsWith(".md")) {
        return true;
      }
      if (entry.isDirectory()) {
        if (fs.existsSync(path.join(fullPath, "SKILL.md"))) {
          return true;
        }
      }
    }
  } catch {
    return false;
  }
  return false;
}

export type BundledSkillsResolveOptions = {
  argv1?: string;
  moduleUrl?: string;
  cwd?: string;
  execPath?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveBundledSkillsDir(
  opts: BundledSkillsResolveOptions = {},
): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const override = process.env.OPENCLAW_BUNDLED_SKILLS_DIR?.trim();
  if (override) {
    return override;
  }

  // bun --compile: ship a sibling `skills/` next to the executable.
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const execPath = opts.execPath ?? process.execPath;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const execDir = path.dirname(execPath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sibling = path.join(execDir, "skills");
    if (fs.existsSync(sibling)) {
      return sibling;
    }
  } catch {
    // ignore
  }

  // npm/dev: resolve `<packageRoot>/skills` relative to this module.
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const moduleUrl = opts.moduleUrl ?? import.meta.url;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const moduleDir = path.dirname(fileURLToPath(moduleUrl));
    const argv1 = opts.argv1 ?? process.argv[1];
    const cwd = opts.cwd ?? process.cwd();
    const packageRoot = resolveOpenClawPackageRootSync({
      argv1,
      moduleUrl,
      cwd,
    });
    if (packageRoot) {
      const candidate = path.join(packageRoot, "skills");
      if (looksLikeSkillsDir(candidate)) {
        return candidate;
      }
    }
    let current = moduleDir;
    for (let depth = 0; depth < 6; depth += 1) {
      const candidate = path.join(current, "skills");
      if (looksLikeSkillsDir(candidate)) {
        return candidate;
      }
      const next = path.dirname(current);
      if (next === current) {
        break;
      }
      current = next;
    }
  } catch {
    // ignore
  }

  return undefined;
}
