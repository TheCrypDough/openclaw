/*
 * AUTO ANNOTATION
 * File: src/agents/skills.summarize-skill-description.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./skills/frontmatter.js";

describe("skills/summarize frontmatter", () => {
  it("mentions podcasts, local files, and transcription use cases", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const skillPath = path.join(process.cwd(), "skills", "summarize", "SKILL.md");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = fs.readFileSync(skillPath, "utf-8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const frontmatter = parseFrontmatter(raw);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const description = frontmatter.description ?? "";
    expect(description.toLowerCase()).toContain("transcrib");
    expect(description.toLowerCase()).toContain("podcast");
    expect(description.toLowerCase()).toContain("local files");
    expect(description).not.toContain("summarize.sh");
  });
});
