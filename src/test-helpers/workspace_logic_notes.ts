/*
 * AUTO ANNOTATION
 * File: src/test-helpers/workspace.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function makeTempWorkspace(prefix = "openclaw-workspace-"): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function writeWorkspaceFile(params: {
  dir: string;
  name: string;
  content: string;
}): Promise<string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const filePath = path.join(params.dir, params.name);
  await fs.writeFile(filePath, params.content, "utf-8");
  return filePath;
}
