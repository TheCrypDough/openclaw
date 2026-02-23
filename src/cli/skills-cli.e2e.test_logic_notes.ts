/*
 * AUTO ANNOTATION
 * File: src/cli/skills-cli.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildWorkspaceSkillStatus } from "../agents/skills-status.js";
import type { SkillEntry } from "../agents/skills.js";
import { captureEnv } from "../test-utils/env.js";
import { formatSkillInfo, formatSkillsCheck, formatSkillsList } from "./skills-cli.format.js";

describe("skills-cli (e2e)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let tempWorkspaceDir = "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let tempBundledDir = "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let envSnapshot: ReturnType<typeof captureEnv>;

  beforeAll(() => {
    envSnapshot = captureEnv(["OPENCLAW_BUNDLED_SKILLS_DIR"]);
    tempWorkspaceDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-skills-test-"));
    tempBundledDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-bundled-skills-test-"));
    process.env.OPENCLAW_BUNDLED_SKILLS_DIR = tempBundledDir;
  });

  afterAll(() => {
    if (tempWorkspaceDir) {
      fs.rmSync(tempWorkspaceDir, { recursive: true, force: true });
    }
    if (tempBundledDir) {
      fs.rmSync(tempBundledDir, { recursive: true, force: true });
    }
    envSnapshot.restore();
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function createEntries(): SkillEntry[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const baseDir = path.join(tempWorkspaceDir, "peekaboo");
    return [
      {
        skill: {
          name: "peekaboo",
          description: "Capture UI screenshots",
          source: "openclaw-bundled",
          filePath: path.join(baseDir, "SKILL.md"),
          baseDir,
        } as SkillEntry["skill"],
        frontmatter: {},
        metadata: { emoji: "📸" },
      },
    ];
  }

  it("loads bundled skills and formats them", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const entries = createEntries();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const report = buildWorkspaceSkillStatus(tempWorkspaceDir, {
      managedSkillsDir: "/nonexistent",
      entries,
    });

    expect(report.skills.length).toBeGreaterThan(0);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const listOutput = formatSkillsList(report, {});
    expect(listOutput).toContain("Skills");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const checkOutput = formatSkillsCheck(report, {});
    expect(checkOutput).toContain("Total:");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const jsonOutput = formatSkillsList(report, { json: true });
    const parsed = JSON.parse(jsonOutput);
    expect(parsed.skills).toBeInstanceOf(Array);
  });

  it("formats info for a real bundled skill (peekaboo)", () => {
    const entries = createEntries();
    const report = buildWorkspaceSkillStatus(tempWorkspaceDir, {
      managedSkillsDir: "/nonexistent",
      entries,
    });

    const peekaboo = report.skills.find((s) => s.name === "peekaboo");
    if (!peekaboo) {
      throw new Error("peekaboo fixture skill missing");
    }

    const output = formatSkillInfo(report, "peekaboo", {});
    expect(output).toContain("peekaboo");
    expect(output).toContain("Details:");
  });
});
