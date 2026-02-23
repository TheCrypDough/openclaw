/*
 * AUTO ANNOTATION
 * File: src/commands/doctor-install.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import { note } from "../terminal/note.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function noteSourceInstallIssues(root: string | null) {
  if (!root) {
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const workspaceMarker = path.join(root, "pnpm-workspace.yaml");
  if (!fs.existsSync(workspaceMarker)) {
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const warnings: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const nodeModules = path.join(root, "node_modules");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pnpmStore = path.join(nodeModules, ".pnpm");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tsxBin = path.join(nodeModules, ".bin", "tsx");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const srcEntry = path.join(root, "src", "entry.ts");

  if (fs.existsSync(nodeModules) && !fs.existsSync(pnpmStore)) {
    warnings.push(
      "- node_modules was not installed by pnpm (missing node_modules/.pnpm). Run: pnpm install",
    );
  }

  if (fs.existsSync(path.join(root, "package-lock.json"))) {
    warnings.push(
      "- package-lock.json present in a pnpm workspace. If you ran npm install, remove it and reinstall with pnpm.",
    );
  }

  if (fs.existsSync(srcEntry) && !fs.existsSync(tsxBin)) {
    warnings.push("- tsx binary is missing for source runs. Run: pnpm install");
  }

  if (warnings.length > 0) {
    note(warnings.join("\n"), "Install");
  }
}
