/*
 * AUTO ANNOTATION
 * File: src/agents/workspace-templates.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveOpenClawPackageRoot } from "../infra/openclaw-root.js";
import { pathExists } from "../utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const FALLBACK_TEMPLATE_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../docs/reference/templates",
);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let cachedTemplateDir: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let resolvingTemplateDir: Promise<string> | undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveWorkspaceTemplateDir(opts?: {
  cwd?: string;
  argv1?: string;
  moduleUrl?: string;
}): Promise<string> {
  if (cachedTemplateDir) {
    return cachedTemplateDir;
  }
  if (resolvingTemplateDir) {
    return resolvingTemplateDir;
  }

  resolvingTemplateDir = (async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const moduleUrl = opts?.moduleUrl ?? import.meta.url;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const argv1 = opts?.argv1 ?? process.argv[1];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cwd = opts?.cwd ?? process.cwd();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const packageRoot = await resolveOpenClawPackageRoot({ moduleUrl, argv1, cwd });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const candidates = [
      packageRoot ? path.join(packageRoot, "docs", "reference", "templates") : null,
      cwd ? path.resolve(cwd, "docs", "reference", "templates") : null,
      FALLBACK_TEMPLATE_DIR,
    ].filter(Boolean) as string[];

    for (const candidate of candidates) {
      if (await pathExists(candidate)) {
        cachedTemplateDir = candidate;
        return candidate;
      }
    }

    cachedTemplateDir = candidates[0] ?? FALLBACK_TEMPLATE_DIR;
    return cachedTemplateDir;
  })();

  try {
    return await resolvingTemplateDir;
  } finally {
    resolvingTemplateDir = undefined;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resetWorkspaceTemplateDirCache() {
  cachedTemplateDir = undefined;
  resolvingTemplateDir = undefined;
}
