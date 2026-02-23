/*
 * AUTO ANNOTATION
 * File: scripts/write-build-info.ts
 * Purpose: Operational script for maintenance/build/release/test workflows (write-build-info.ts).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const distDir = path.join(rootDir, "dist");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const pkgPath = path.join(rootDir, "package.json");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const readPackageVersion = () => {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = fs.readFileSync(pkgPath, "utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON.parse(raw) as { version?: string };
    return parsed.version ?? null;
  } catch {
    return null;
  }
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const resolveCommit = () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const envCommit = process.env.GIT_COMMIT?.trim() || process.env.GIT_SHA?.trim();
  if (envCommit) {
    return envCommit;
  }
  try {
    return execSync("git rev-parse HEAD", {
      cwd: rootDir,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return null;
  }
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const version = readPackageVersion();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const commit = resolveCommit();

const buildInfo = {
  version,
  commit,
  builtAt: new Date().toISOString(),
};

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, "build-info.json"), `${JSON.stringify(buildInfo, null, 2)}\n`);
