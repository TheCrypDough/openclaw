/*
 * AUTO ANNOTATION
 * File: src/infra/package-json.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function readPackageVersion(root: string): Promise<string | null> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = await fs.readFile(path.join(root, "package.json"), "utf-8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON.parse(raw) as { version?: string };
    return typeof parsed?.version === "string" ? parsed.version : null;
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function readPackageName(root: string): Promise<string | null> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = await fs.readFile(path.join(root, "package.json"), "utf-8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON.parse(raw) as { name?: string };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const name = parsed?.name?.trim();
    return name ? name : null;
  } catch {
    return null;
  }
}
