/*
 * AUTO ANNOTATION
 * File: src/agents/sandbox-skills.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { captureFullEnv } from "../test-utils/env.js";
import { resolveSandboxContext } from "./sandbox.js";
import { writeSkill } from "./skills.e2e-test-helpers.js";

vi.mock("./sandbox/docker.js", () => ({
  ensureSandboxContainer: vi.fn(async () => "openclaw-sbx-test"),
}));

vi.mock("./sandbox/browser.js", () => ({
  ensureSandboxBrowser: vi.fn(async () => null),
}));

vi.mock("./sandbox/prune.js", () => ({
  maybePruneSandboxes: vi.fn(async () => undefined),
}));

describe("sandbox skill mirroring", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let envSnapshot: ReturnType<typeof captureFullEnv>;

  beforeEach(() => {
    envSnapshot = captureFullEnv();
  });

  afterEach(() => {
    envSnapshot.restore();
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runContext = async (workspaceAccess: "none" | "ro") => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const bundledDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-bundled-skills-"));
    await fs.mkdir(bundledDir, { recursive: true });

    process.env.OPENCLAW_BUNDLED_SKILLS_DIR = bundledDir;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-workspace-"));
    await writeSkill({
      dir: path.join(workspaceDir, "skills", "demo-skill"),
      name: "demo-skill",
      description: "Demo skill",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      agents: {
        defaults: {
          sandbox: {
            mode: "all",
            scope: "session",
            workspaceAccess,
            workspaceRoot: path.join(bundledDir, "sandboxes"),
          },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const context = await resolveSandboxContext({
      config: cfg,
      sessionKey: "agent:main:main",
      workspaceDir,
    });

    return { context, workspaceDir };
  };

  it("copies skills into the sandbox when workspaceAccess is ro", async () => {
    const { context } = await runContext("ro");

    expect(context?.enabled).toBe(true);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const skillPath = path.join(context?.workspaceDir ?? "", "skills", "demo-skill", "SKILL.md");
    await expect(fs.readFile(skillPath, "utf-8")).resolves.toContain("demo-skill");
  }, 20_000);

  it("copies skills into the sandbox when workspaceAccess is none", async () => {
    const { context } = await runContext("none");

    expect(context?.enabled).toBe(true);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const skillPath = path.join(context?.workspaceDir ?? "", "skills", "demo-skill", "SKILL.md");
    await expect(fs.readFile(skillPath, "utf-8")).resolves.toContain("demo-skill");
  }, 20_000);
});
