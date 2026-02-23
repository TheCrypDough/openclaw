/*
 * AUTO ANNOTATION
 * File: src/infra/detect-package-manager.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";

export type DetectedPackageManager = "pnpm" | "bun" | "npm";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function detectPackageManager(root: string): Promise<DetectedPackageManager | null> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = await fs.readFile(path.join(root, "package.json"), "utf-8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON.parse(raw) as { packageManager?: string };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pm = parsed?.packageManager?.split("@")[0]?.trim();
    if (pm === "pnpm" || pm === "bun" || pm === "npm") {
      return pm;
    }
  } catch {
    // ignore
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const files = await fs.readdir(root).catch((): string[] => []);
  if (files.includes("pnpm-lock.yaml")) {
    return "pnpm";
  }
  if (files.includes("bun.lockb")) {
    return "bun";
  }
  if (files.includes("package-lock.json")) {
    return "npm";
  }
  return null;
}
