/*
 * AUTO ANNOTATION
 * File: src/agents/workspace-templates.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import {
  resetWorkspaceTemplateDirCache,
  resolveWorkspaceTemplateDir,
} from "./workspace-templates.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const tempDirs: string[] = [];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function makeTempRoot(): Promise<string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-templates-"));
  tempDirs.push(root);
  return root;
}

describe("resolveWorkspaceTemplateDir", () => {
  afterEach(async () => {
    resetWorkspaceTemplateDirCache();
    await Promise.all(
      tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })),
    );
  });

  it("resolves templates from package root when module url is dist-rooted", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const root = await makeTempRoot();
    await fs.writeFile(path.join(root, "package.json"), JSON.stringify({ name: "openclaw" }));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const templatesDir = path.join(root, "docs", "reference", "templates");
    await fs.mkdir(templatesDir, { recursive: true });
    await fs.writeFile(path.join(templatesDir, "AGENTS.md"), "# ok\n");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const distDir = path.join(root, "dist");
    await fs.mkdir(distDir, { recursive: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const moduleUrl = pathToFileURL(path.join(distDir, "model-selection.mjs")).toString();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = await resolveWorkspaceTemplateDir({ cwd: distDir, moduleUrl });
    expect(resolved).toBe(templatesDir);
  });

  it("falls back to package-root docs path when templates directory is missing", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const root = await makeTempRoot();
    await fs.writeFile(path.join(root, "package.json"), JSON.stringify({ name: "openclaw" }));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const distDir = path.join(root, "dist");
    await fs.mkdir(distDir, { recursive: true });
    const moduleUrl = pathToFileURL(path.join(distDir, "model-selection.mjs")).toString();

    const resolved = await resolveWorkspaceTemplateDir({ cwd: distDir, moduleUrl });
    expect(path.normalize(resolved)).toBe(path.resolve("docs", "reference", "templates"));
  });
});
