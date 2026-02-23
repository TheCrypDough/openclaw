/*
 * AUTO ANNOTATION
 * File: src/agents/skills/bundled-dir.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { captureEnv } from "../../test-utils/env.js";
import { writeSkill } from "../skills.e2e-test-helpers.js";
import { resolveBundledSkillsDir } from "./bundled-dir.js";

describe("resolveBundledSkillsDir", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let envSnapshot: ReturnType<typeof captureEnv>;

  beforeEach(() => {
    envSnapshot = captureEnv(["OPENCLAW_BUNDLED_SKILLS_DIR"]);
  });

  afterEach(() => {
    envSnapshot.restore();
  });

  it("returns OPENCLAW_BUNDLED_SKILLS_DIR override when set", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const overrideDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-bundled-override-"));
    process.env.OPENCLAW_BUNDLED_SKILLS_DIR = ` ${overrideDir} `;
    expect(resolveBundledSkillsDir()).toBe(overrideDir);
  });

  it("resolves bundled skills under a flattened dist layout", async () => {
    delete process.env.OPENCLAW_BUNDLED_SKILLS_DIR;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-bundled-"));
    await fs.writeFile(path.join(root, "package.json"), JSON.stringify({ name: "openclaw" }));

    await writeSkill({
      dir: path.join(root, "skills", "peekaboo"),
      name: "peekaboo",
      description: "peekaboo",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const distDir = path.join(root, "dist");
    await fs.mkdir(distDir, { recursive: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const argv1 = path.join(distDir, "index.js");
    await fs.writeFile(argv1, "// stub", "utf-8");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const moduleUrl = pathToFileURL(path.join(distDir, "skills.js")).href;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const execPath = path.join(root, "bin", "node");
    await fs.mkdir(path.dirname(execPath), { recursive: true });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = resolveBundledSkillsDir({
      argv1,
      moduleUrl,
      cwd: distDir,
      execPath,
    });

    expect(resolved).toBe(path.join(root, "skills"));
  });
});
