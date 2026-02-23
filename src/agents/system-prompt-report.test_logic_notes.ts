/*
 * AUTO ANNOTATION
 * File: src/agents/system-prompt-report.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { buildSystemPromptReport } from "./system-prompt-report.js";
import type { WorkspaceBootstrapFile } from "./workspace.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeBootstrapFile(overrides: Partial<WorkspaceBootstrapFile>): WorkspaceBootstrapFile {
  return {
    name: "AGENTS.md",
    path: "/tmp/workspace/AGENTS.md",
    content: "alpha",
    missing: false,
    ...overrides,
  };
}

describe("buildSystemPromptReport", () => {
  it("counts injected chars when injected file paths are absolute", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const file = makeBootstrapFile({ path: "/tmp/workspace/policies/AGENTS.md" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const report = buildSystemPromptReport({
      source: "run",
      generatedAt: 0,
      bootstrapMaxChars: 20_000,
      systemPrompt: "system",
      bootstrapFiles: [file],
      injectedFiles: [{ path: "/tmp/workspace/policies/AGENTS.md", content: "trimmed" }],
      skillsPrompt: "",
      tools: [],
    });

    expect(report.injectedWorkspaceFiles[0]?.injectedChars).toBe("trimmed".length);
  });

  it("keeps legacy basename matching for injected files", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const file = makeBootstrapFile({ path: "/tmp/workspace/policies/AGENTS.md" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const report = buildSystemPromptReport({
      source: "run",
      generatedAt: 0,
      bootstrapMaxChars: 20_000,
      systemPrompt: "system",
      bootstrapFiles: [file],
      injectedFiles: [{ path: "AGENTS.md", content: "trimmed" }],
      skillsPrompt: "",
      tools: [],
    });

    expect(report.injectedWorkspaceFiles[0]?.injectedChars).toBe("trimmed".length);
  });

  it("marks workspace files truncated when injected chars are smaller than raw chars", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const file = makeBootstrapFile({
      path: "/tmp/workspace/policies/AGENTS.md",
      content: "abcdefghijklmnopqrstuvwxyz",
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const report = buildSystemPromptReport({
      source: "run",
      generatedAt: 0,
      bootstrapMaxChars: 20_000,
      systemPrompt: "system",
      bootstrapFiles: [file],
      injectedFiles: [{ path: "/tmp/workspace/policies/AGENTS.md", content: "trimmed" }],
      skillsPrompt: "",
      tools: [],
    });

    expect(report.injectedWorkspaceFiles[0]?.truncated).toBe(true);
  });

  it("includes both bootstrap caps in the report payload", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const file = makeBootstrapFile({ path: "/tmp/workspace/policies/AGENTS.md" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const report = buildSystemPromptReport({
      source: "run",
      generatedAt: 0,
      bootstrapMaxChars: 11_111,
      bootstrapTotalMaxChars: 22_222,
      systemPrompt: "system",
      bootstrapFiles: [file],
      injectedFiles: [{ path: "AGENTS.md", content: "trimmed" }],
      skillsPrompt: "",
      tools: [],
    });

    expect(report.bootstrapMaxChars).toBe(11_111);
    expect(report.bootstrapTotalMaxChars).toBe(22_222);
  });
});
