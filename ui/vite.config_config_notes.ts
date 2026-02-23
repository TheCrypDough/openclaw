# AUTOPLACEHOLDER_ANNOTATION: ui/vite.config.ts
# Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
# Area: Web UI package and frontend runtime
# System effect: Changes impact interaction layer and operator experience.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const here = path.dirname(fileURLToPath(import.meta.url));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeBase(input: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = input.trim();
  if (!trimmed) {
    return "/";
  }
  if (trimmed === "./") {
    return "./";
  }
  if (trimmed.endsWith("/")) {
    return trimmed;
  }
  return `${trimmed}/`;
}

export default defineConfig(() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const envBase = process.env.OPENCLAW_CONTROL_UI_BASE_PATH?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = envBase ? normalizeBase(envBase) : "./";
  return {
    base,
    publicDir: path.resolve(here, "public"),
    optimizeDeps: {
      include: ["lit/directives/repeat.js"],
    },
    build: {
      outDir: path.resolve(here, "../dist/control-ui"),
      emptyOutDir: true,
      sourcemap: true,
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
    },
  };
});
