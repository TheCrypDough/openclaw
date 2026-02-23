/*
 * AUTO ANNOTATION
 * File: src/agents/skills.build-workspace-skills-prompt.prefers-workspace-skills-managed-skills.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { withEnv } from "../test-utils/env.js";
import { writeSkill } from "./skills.e2e-test-helpers.js";
import { buildWorkspaceSkillsPrompt } from "./skills.js";

describe("buildWorkspaceSkillsPrompt", () => {
  it("prefers workspace skills over managed skills", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const managedDir = path.join(workspaceDir, ".managed");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const bundledDir = path.join(workspaceDir, ".bundled");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const managedSkillDir = path.join(managedDir, "demo-skill");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const bundledSkillDir = path.join(bundledDir, "demo-skill");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const workspaceSkillDir = path.join(workspaceDir, "skills", "demo-skill");

    await writeSkill({
      dir: bundledSkillDir,
      name: "demo-skill",
      description: "Bundled version",
      body: "# Bundled\n",
    });
    await writeSkill({
      dir: managedSkillDir,
      name: "demo-skill",
      description: "Managed version",
      body: "# Managed\n",
    });
    await writeSkill({
      dir: workspaceSkillDir,
      name: "demo-skill",
      description: "Workspace version",
      body: "# Workspace\n",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prompt = buildWorkspaceSkillsPrompt(workspaceDir, {
      managedSkillsDir: managedDir,
      bundledSkillsDir: bundledDir,
    });

    expect(prompt).toContain("Workspace version");
    expect(prompt).toContain(path.join(workspaceSkillDir, "SKILL.md"));
    expect(prompt).not.toContain(path.join(managedSkillDir, "SKILL.md"));
    expect(prompt).not.toContain(path.join(bundledSkillDir, "SKILL.md"));
  });
  it("gates by bins, config, and always", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const skillsDir = path.join(workspaceDir, "skills");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const binDir = path.join(workspaceDir, "bin");

    await writeSkill({
      dir: path.join(skillsDir, "bin-skill"),
      name: "bin-skill",
      description: "Needs a bin",
      metadata: '{"openclaw":{"requires":{"bins":["fakebin"]}}}',
    });
    await writeSkill({
      dir: path.join(skillsDir, "anybin-skill"),
      name: "anybin-skill",
      description: "Needs any bin",
      metadata: '{"openclaw":{"requires":{"anyBins":["missingbin","fakebin"]}}}',
    });
    await writeSkill({
      dir: path.join(skillsDir, "config-skill"),
      name: "config-skill",
      description: "Needs config",
      metadata: '{"openclaw":{"requires":{"config":["browser.enabled"]}}}',
    });
    await writeSkill({
      dir: path.join(skillsDir, "always-skill"),
      name: "always-skill",
      description: "Always on",
      metadata: '{"openclaw":{"always":true,"requires":{"env":["MISSING"]}}}',
    });
    await writeSkill({
      dir: path.join(skillsDir, "env-skill"),
      name: "env-skill",
      description: "Needs env",
      metadata: '{"openclaw":{"requires":{"env":["ENV_KEY"]},"primaryEnv":"ENV_KEY"}}',
    });

    const defaultPrompt = buildWorkspaceSkillsPrompt(workspaceDir, {
      managedSkillsDir: path.join(workspaceDir, ".managed"),
    });
    expect(defaultPrompt).toContain("always-skill");
    expect(defaultPrompt).toContain("config-skill");
    expect(defaultPrompt).not.toContain("bin-skill");
    expect(defaultPrompt).not.toContain("anybin-skill");
    expect(defaultPrompt).not.toContain("env-skill");

    await fs.mkdir(binDir, { recursive: true });
    const fakebinPath = path.join(binDir, "fakebin");
    await fs.writeFile(fakebinPath, "#!/bin/sh\nexit 0\n", "utf-8");
    await fs.chmod(fakebinPath, 0o755);

    withEnv({ PATH: `${binDir}${path.delimiter}${process.env.PATH ?? ""}` }, () => {
      const gatedPrompt = buildWorkspaceSkillsPrompt(workspaceDir, {
        managedSkillsDir: path.join(workspaceDir, ".managed"),
        config: {
          browser: { enabled: false },
          skills: { entries: { "env-skill": { apiKey: "ok" } } },
        },
      });
      expect(gatedPrompt).toContain("bin-skill");
      expect(gatedPrompt).toContain("anybin-skill");
      expect(gatedPrompt).toContain("env-skill");
      expect(gatedPrompt).toContain("always-skill");
      expect(gatedPrompt).not.toContain("config-skill");
    });
  });
  it("uses skillKey for config lookups", async () => {
    const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-"));
    const skillDir = path.join(workspaceDir, "skills", "alias-skill");
    await writeSkill({
      dir: skillDir,
      name: "alias-skill",
      description: "Uses skillKey",
      metadata: '{"openclaw":{"skillKey":"alias"}}',
    });

    const prompt = buildWorkspaceSkillsPrompt(workspaceDir, {
      managedSkillsDir: path.join(workspaceDir, ".managed"),
      config: { skills: { entries: { alias: { enabled: false } } } },
    });
    expect(prompt).not.toContain("alias-skill");
  });
});
