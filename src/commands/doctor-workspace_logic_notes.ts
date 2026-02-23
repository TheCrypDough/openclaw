/*
 * AUTO ANNOTATION
 * File: src/commands/doctor-workspace.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_AGENTS_FILENAME } from "../agents/workspace.js";
import { shortenHomePath } from "../utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const MEMORY_SYSTEM_PROMPT = [
  "Memory system not found in workspace.",
  "Paste this into your agent:",
  "",
  "Install the memory system by applying:",
  "https://github.com/openclaw/openclaw/commit/9ffea23f31ca1df5183b25668f8f814bee0fb34e",
  "https://github.com/openclaw/openclaw/commit/7d1fee70e76f2f634f1b41fca927ee663914183a",
].join("\n");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function shouldSuggestMemorySystem(workspaceDir: string): Promise<boolean> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const memoryPaths = [path.join(workspaceDir, "MEMORY.md"), path.join(workspaceDir, "memory.md")];

  for (const memoryPath of memoryPaths) {
    try {
      await fs.promises.access(memoryPath);
      return false;
    } catch {
      // keep scanning
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentsPath = path.join(workspaceDir, DEFAULT_AGENTS_FILENAME);
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const content = await fs.promises.readFile(agentsPath, "utf-8");
    if (/memory\.md/i.test(content)) {
      return false;
    }
  } catch {
    // no AGENTS.md or unreadable; treat as missing memory guidance
  }

  return true;
}

export type LegacyWorkspaceDetection = {
  activeWorkspace: string;
  legacyDirs: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function detectLegacyWorkspaceDirs(params: {
  workspaceDir: string;
}): LegacyWorkspaceDetection {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const activeWorkspace = path.resolve(params.workspaceDir);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const legacyDirs: string[] = [];
  return { activeWorkspace, legacyDirs };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatLegacyWorkspaceWarning(detection: LegacyWorkspaceDetection): string {
  return [
    "Extra workspace directories detected (may contain old agent files):",
    ...detection.legacyDirs.map((dir) => `- ${shortenHomePath(dir)}`),
    `Active workspace: ${shortenHomePath(detection.activeWorkspace)}`,
    "If unused, archive or move to Trash.",
  ].join("\n");
}
