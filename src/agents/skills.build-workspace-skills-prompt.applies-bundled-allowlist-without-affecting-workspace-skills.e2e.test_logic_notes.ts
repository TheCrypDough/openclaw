/*
 * AUTO ANNOTATION
 * File: src/agents/skills.build-workspace-skills-prompt.applies-bundled-allowlist-without-affecting-workspace-skills.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { writeSkill } from "./skills.e2e-test-helpers.js";
import { buildWorkspaceSkillsPrompt } from "./skills.js";

describe("buildWorkspaceSkillsPrompt", () => {
  it("applies bundled allowlist without affecting workspace skills", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const bundledDir = path.join(workspaceDir, ".bundled");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const bundledSkillDir = path.join(bundledDir, "peekaboo");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const workspaceSkillDir = path.join(workspaceDir, "skills", "demo-skill");

    await writeSkill({
      dir: bundledSkillDir,
      name: "peekaboo",
      description: "Capture UI",
      body: "# Peekaboo\n",
    });
    await writeSkill({
      dir: workspaceSkillDir,
      name: "demo-skill",
      description: "Workspace version",
      body: "# Workspace\n",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prompt = buildWorkspaceSkillsPrompt(workspaceDir, {
      bundledSkillsDir: bundledDir,
      managedSkillsDir: path.join(workspaceDir, ".managed"),
      config: { skills: { allowBundled: ["missing-skill"] } },
    });

    expect(prompt).toContain("Workspace version");
    expect(prompt).not.toContain("peekaboo");
  });
});
