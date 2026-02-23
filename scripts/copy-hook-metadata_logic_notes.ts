/*
 * AUTO ANNOTATION
 * File: scripts/copy-hook-metadata.ts
 * Purpose: Operational script for maintenance/build/release/test workflows (copy-hook-metadata.ts).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
#!/usr/bin/env tsx
/**
 * Copy HOOK.md files from src/hooks/bundled to dist/bundled
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const projectRoot = path.resolve(__dirname, "..");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const srcBundled = path.join(projectRoot, "src", "hooks", "bundled");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const distBundled = path.join(projectRoot, "dist", "bundled");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function copyHookMetadata() {
  if (!fs.existsSync(srcBundled)) {
    console.warn("[copy-hook-metadata] Source directory not found:", srcBundled);
    return;
  }

  if (!fs.existsSync(distBundled)) {
    fs.mkdirSync(distBundled, { recursive: true });
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries = fs.readdirSync(srcBundled, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const hookName = entry.name;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const srcHookDir = path.join(srcBundled, hookName);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const distHookDir = path.join(distBundled, hookName);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const srcHookMd = path.join(srcHookDir, "HOOK.md");
    const distHookMd = path.join(distHookDir, "HOOK.md");

    if (!fs.existsSync(srcHookMd)) {
      console.warn(`[copy-hook-metadata] No HOOK.md found for ${hookName}`);
      continue;
    }

    if (!fs.existsSync(distHookDir)) {
      fs.mkdirSync(distHookDir, { recursive: true });
    }

    fs.copyFileSync(srcHookMd, distHookMd);
    console.log(`[copy-hook-metadata] Copied ${hookName}/HOOK.md`);
  }

  console.log("[copy-hook-metadata] Done");
}

copyHookMetadata();
