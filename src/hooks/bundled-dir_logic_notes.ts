/*
 * AUTO ANNOTATION
 * File: src/hooks/bundled-dir.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveBundledHooksDir(): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const override = process.env.OPENCLAW_BUNDLED_HOOKS_DIR?.trim();
  if (override) {
    return override;
  }

  // bun --compile: ship a sibling `hooks/bundled/` next to the executable.
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const execDir = path.dirname(process.execPath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sibling = path.join(execDir, "hooks", "bundled");
    if (fs.existsSync(sibling)) {
      return sibling;
    }
  } catch {
    // ignore
  }

  // npm: resolve `<packageRoot>/dist/hooks/bundled` relative to this module (compiled hooks).
  // This path works when installed via npm: node_modules/openclaw/dist/hooks/bundled-dir.js
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const moduleDir = path.dirname(fileURLToPath(import.meta.url));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const distBundled = path.join(moduleDir, "bundled");
    if (fs.existsSync(distBundled)) {
      return distBundled;
    }
  } catch {
    // ignore
  }

  // dev: resolve `<packageRoot>/src/hooks/bundled` relative to dist/hooks/bundled-dir.js
  // This path works in dev: dist/hooks/bundled-dir.js -> ../../src/hooks/bundled
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const moduleDir = path.dirname(fileURLToPath(import.meta.url));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const root = path.resolve(moduleDir, "..", "..");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const srcBundled = path.join(root, "src", "hooks", "bundled");
    if (fs.existsSync(srcBundled)) {
      return srcBundled;
    }
  } catch {
    // ignore
  }

  return undefined;
}
