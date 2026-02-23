/*
 * AUTO ANNOTATION
 * File: scripts/sync-plugin-versions.ts
 * Purpose: Operational script for maintenance/build/release/test workflows (sync-plugin-versions.ts).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type PackageJson = {
  name?: string;
  version?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const rootPackagePath = resolve("package.json");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const rootPackage = JSON.parse(readFileSync(rootPackagePath, "utf8")) as PackageJson;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const targetVersion = rootPackage.version;

if (!targetVersion) {
  throw new Error("Root package.json missing version.");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const extensionsDir = resolve("extensions");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const dirs = readdirSync(extensionsDir, { withFileTypes: true }).filter((entry) =>
  entry.isDirectory(),
);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const updated: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const changelogged: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const skipped: string[] = [];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function ensureChangelogEntry(changelogPath: string, version: string): boolean {
  if (!existsSync(changelogPath)) {
    return false;
  }
  const content = readFileSync(changelogPath, "utf8");
  if (content.includes(`## ${version}`)) {
    return false;
  }
  const entry = `## ${version}\n\n### Changes\n- Version alignment with core OpenClaw release numbers.\n\n`;
  if (content.startsWith("# Changelog\n\n")) {
    const next = content.replace("# Changelog\n\n", `# Changelog\n\n${entry}`);
    writeFileSync(changelogPath, next);
    return true;
  }
  const next = `# Changelog\n\n${entry}${content.trimStart()}`;
  writeFileSync(changelogPath, `${next}\n`);
  return true;
}

for (const dir of dirs) {
  const packagePath = join(extensionsDir, dir.name, "package.json");
  let pkg: PackageJson;
  try {
    pkg = JSON.parse(readFileSync(packagePath, "utf8")) as PackageJson;
  } catch {
    continue;
  }

  if (!pkg.name) {
    skipped.push(dir.name);
    continue;
  }

  const changelogPath = join(extensionsDir, dir.name, "CHANGELOG.md");
  if (ensureChangelogEntry(changelogPath, targetVersion)) {
    changelogged.push(pkg.name);
  }

  if (pkg.version === targetVersion) {
    skipped.push(pkg.name);
    continue;
  }

  pkg.version = targetVersion;
  writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
  updated.push(pkg.name);
}

console.log(
  `Synced plugin versions to ${targetVersion}. Updated: ${updated.length}. Changelogged: ${changelogged.length}. Skipped: ${skipped.length}.`,
);
