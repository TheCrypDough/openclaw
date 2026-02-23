/*
 * AUTO ANNOTATION
 * File: scripts/canvas-a2ui-copy.ts
 * Purpose: Operational script for maintenance/build/release/test workflows (canvas-a2ui-copy.ts).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getA2uiPaths(env = process.env) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const srcDir = env.OPENCLAW_A2UI_SRC_DIR ?? path.join(repoRoot, "src", "canvas-host", "a2ui");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const outDir = env.OPENCLAW_A2UI_OUT_DIR ?? path.join(repoRoot, "dist", "canvas-host", "a2ui");
  return { srcDir, outDir };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function copyA2uiAssets({ srcDir, outDir }: { srcDir: string; outDir: string }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const skipMissing = process.env.OPENCLAW_A2UI_SKIP_MISSING === "1";
  try {
    await fs.stat(path.join(srcDir, "index.html"));
    await fs.stat(path.join(srcDir, "a2ui.bundle.js"));
  } catch (err) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = 'Missing A2UI bundle assets. Run "pnpm canvas:a2ui:bundle" and retry.';
    if (skipMissing) {
      console.warn(`${message} Skipping copy (OPENCLAW_A2UI_SKIP_MISSING=1).`);
      return;
    }
    throw new Error(message, { cause: err });
  }
  await fs.mkdir(path.dirname(outDir), { recursive: true });
  await fs.cp(srcDir, outDir, { recursive: true });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function main() {
  const { srcDir, outDir } = getA2uiPaths();
  await copyA2uiAssets({ srcDir, outDir });
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((err) => {
    console.error(String(err));
    process.exit(1);
  });
}
