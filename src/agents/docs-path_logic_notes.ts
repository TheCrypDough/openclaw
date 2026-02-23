/*
 * AUTO ANNOTATION
 * File: src/agents/docs-path.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import { resolveOpenClawPackageRoot } from "../infra/openclaw-root.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveOpenClawDocsPath(params: {
  workspaceDir?: string;
  argv1?: string;
  cwd?: string;
  moduleUrl?: string;
}): Promise<string | null> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const workspaceDir = params.workspaceDir?.trim();
  if (workspaceDir) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const workspaceDocs = path.join(workspaceDir, "docs");
    if (fs.existsSync(workspaceDocs)) {
      return workspaceDocs;
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const packageRoot = await resolveOpenClawPackageRoot({
    cwd: params.cwd,
    argv1: params.argv1,
    moduleUrl: params.moduleUrl,
  });
  if (!packageRoot) {
    return null;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const packageDocs = path.join(packageRoot, "docs");
  return fs.existsSync(packageDocs) ? packageDocs : null;
}
