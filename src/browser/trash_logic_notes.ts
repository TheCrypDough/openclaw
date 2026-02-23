/*
 * AUTO ANNOTATION
 * File: src/browser/trash.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runExec } from "../process/exec.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function movePathToTrash(targetPath: string): Promise<string> {
  try {
    await runExec("trash", [targetPath], { timeoutMs: 10_000 });
    return targetPath;
  } catch {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const trashDir = path.join(os.homedir(), ".Trash");
    fs.mkdirSync(trashDir, { recursive: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const base = path.basename(targetPath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let dest = path.join(trashDir, `${base}-${Date.now()}`);
    if (fs.existsSync(dest)) {
      dest = path.join(trashDir, `${base}-${Date.now()}-${Math.random()}`);
    }
    fs.renameSync(targetPath, dest);
    return dest;
  }
}
