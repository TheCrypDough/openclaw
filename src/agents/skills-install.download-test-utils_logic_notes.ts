/*
 * AUTO ANNOTATION
 * File: src/agents/skills-install.download-test-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { captureEnv } from "../test-utils/env.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setTempStateDir(workspaceDir: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stateDir = path.join(workspaceDir, "state");
  process.env.OPENCLAW_STATE_DIR = stateDir;
  return stateDir;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withTempWorkspace(
  run: (params: { workspaceDir: string; stateDir: string }) => Promise<void>,
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const envSnapshot = captureEnv(["OPENCLAW_STATE_DIR"]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-skills-install-"));
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stateDir = setTempStateDir(workspaceDir);
    await run({ workspaceDir, stateDir });
  } finally {
    envSnapshot.restore();
    await fs.rm(workspaceDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function writeDownloadSkill(params: {
  workspaceDir: string;
  name: string;
  installId: string;
  url: string;
  archive: "tar.gz" | "tar.bz2" | "zip";
  stripComponents?: number;
  targetDir: string;
}): Promise<string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const skillDir = path.join(params.workspaceDir, "skills", params.name);
  await fs.mkdir(skillDir, { recursive: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const meta = {
    openclaw: {
      install: [
        {
          id: params.installId,
          kind: "download",
          url: params.url,
          archive: params.archive,
          extract: true,
          stripComponents: params.stripComponents,
          targetDir: params.targetDir,
        },
      ],
    },
  };
  await fs.writeFile(
    path.join(skillDir, "SKILL.md"),
    `---
name: ${params.name}
description: test skill
metadata: ${JSON.stringify(meta)}
---

# ${params.name}
`,
    "utf-8",
  );
  await fs.writeFile(path.join(skillDir, "runner.js"), "export {};\n", "utf-8");
  return skillDir;
}
