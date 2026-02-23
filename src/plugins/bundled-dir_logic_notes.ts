/*
 * AUTO ANNOTATION
 * File: src/plugins/bundled-dir.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveBundledPluginsDir(): string | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const override = process.env.OPENCLAW_BUNDLED_PLUGINS_DIR?.trim();
  if (override) {
    return override;
  }

  // bun --compile: ship a sibling `extensions/` next to the executable.
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const execDir = path.dirname(process.execPath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sibling = path.join(execDir, "extensions");
    if (fs.existsSync(sibling)) {
      return sibling;
    }
  } catch {
    // ignore
  }

  // npm/dev: walk up from this module to find `extensions/` at the package root.
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let cursor = path.dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 6; i += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const candidate = path.join(cursor, "extensions");
      if (fs.existsSync(candidate)) {
        return candidate;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const parent = path.dirname(cursor);
      if (parent === cursor) {
        break;
      }
      cursor = parent;
    }
  } catch {
    // ignore
  }

  return undefined;
}
