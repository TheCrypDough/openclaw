/*
 * AUTO ANNOTATION
 * File: src/infra/git-root.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_GIT_DISCOVERY_MAX_DEPTH = 12;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function walkUpFrom<T>(
  startDir: string,
  opts: { maxDepth?: number },
  resolveAtDir: (dir: string) => T | null | undefined,
): T | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let current = path.resolve(startDir);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxDepth = opts.maxDepth ?? DEFAULT_GIT_DISCOVERY_MAX_DEPTH;
  for (let i = 0; i < maxDepth; i += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = resolveAtDir(current);
    if (resolved !== null && resolved !== undefined) {
      return resolved;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function hasGitMarker(repoRoot: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const gitPath = path.join(repoRoot, ".git");
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stat = fs.statSync(gitPath);
    return stat.isDirectory() || stat.isFile();
  } catch {
    return false;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function findGitRoot(startDir: string, opts: { maxDepth?: number } = {}): string | null {
  // A `.git` file counts as a repo marker even if it is not a valid gitdir pointer.
  return walkUpFrom(startDir, opts, (repoRoot) => (hasGitMarker(repoRoot) ? repoRoot : null));
}

function resolveGitDirFromMarker(repoRoot: string): string | null {
  const gitPath = path.join(repoRoot, ".git");
  try {
    const stat = fs.statSync(gitPath);
    if (stat.isDirectory()) {
      return gitPath;
    }
    if (!stat.isFile()) {
      return null;
    }
    const raw = fs.readFileSync(gitPath, "utf-8");
    const match = raw.match(/gitdir:\s*(.+)/i);
    if (!match?.[1]) {
      return null;
    }
    return path.resolve(repoRoot, match[1].trim());
  } catch {
    return null;
  }
}

export function resolveGitHeadPath(
  startDir: string,
  opts: { maxDepth?: number } = {},
): string | null {
  // Stricter than findGitRoot: keep walking until a resolvable git dir is found.
  return walkUpFrom(startDir, opts, (repoRoot) => {
    const gitDir = resolveGitDirFromMarker(repoRoot);
    return gitDir ? path.join(gitDir, "HEAD") : null;
  });
}
