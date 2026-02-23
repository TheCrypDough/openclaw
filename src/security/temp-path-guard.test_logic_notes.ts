/*
 * AUTO ANNOTATION
 * File: src/security/temp-path-guard.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DYNAMIC_TMPDIR_JOIN_RE = /path\.join\(os\.tmpdir\(\),\s*`[^`]*\$\{[^`]*`/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RUNTIME_ROOTS = ["src", "extensions"];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SKIP_PATTERNS = [
  /\.test\.tsx?$/,
  /\.test-utils\.tsx?$/,
  /\.e2e\.tsx?$/,
  /\.d\.ts$/,
  /[\\/](?:__tests__|tests)[\\/]/,
  /[\\/]test-helpers(?:\.[^\\/]+)?\.ts$/,
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function shouldSkip(relativePath: string): boolean {
  return SKIP_PATTERNS.some((pattern) => pattern.test(relativePath));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function listTsFiles(dir: string): Promise<string[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries = await fs.readdir(dir, { withFileTypes: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const out: string[] = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name.startsWith(".")) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await listTsFiles(fullPath)));
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }
    if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      out.push(fullPath);
    }
  }
  return out;
}

describe("temp path guard", () => {
  it("blocks dynamic template path.join(os.tmpdir(), ...) in runtime source files", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const repoRoot = process.cwd();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const offenders: string[] = [];

    for (const root of RUNTIME_ROOTS) {
      const absRoot = path.join(repoRoot, root);
      const files = await listTsFiles(absRoot);
      for (const file of files) {
        const relativePath = path.relative(repoRoot, file);
        if (shouldSkip(relativePath)) {
          continue;
        }
        const source = await fs.readFile(file, "utf-8");
        if (DYNAMIC_TMPDIR_JOIN_RE.test(source)) {
          offenders.push(relativePath);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
