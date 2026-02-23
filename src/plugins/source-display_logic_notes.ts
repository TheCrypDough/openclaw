/*
 * AUTO ANNOTATION
 * File: src/plugins/source-display.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { resolveConfigDir, shortenHomeInString } from "../utils.js";
import { resolveBundledPluginsDir } from "./bundled-dir.js";
import type { PluginRecord } from "./registry.js";

export type PluginSourceRoots = {
  stock?: string;
  global?: string;
  workspace?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function tryRelative(root: string, filePath: string): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rel = path.relative(root, filePath);
  if (!rel || rel === ".") {
    return null;
  }
  if (rel === "..") {
    return null;
  }
  if (rel.startsWith(`..${path.sep}`) || rel.startsWith("../") || rel.startsWith("..\\")) {
    return null;
  }
  if (path.isAbsolute(rel)) {
    return null;
  }
  // Normalize to forward slashes for display (path.relative uses backslashes on Windows)
  return rel.replaceAll("\\", "/");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolvePluginSourceRoots(params: { workspaceDir?: string }): PluginSourceRoots {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stock = resolveBundledPluginsDir();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const global = path.join(resolveConfigDir(), "extensions");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const workspace = params.workspaceDir
    ? path.join(params.workspaceDir, ".openclaw", "extensions")
    : undefined;
  return { stock, global, workspace };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatPluginSourceForTable(
  plugin: Pick<PluginRecord, "source" | "origin">,
  roots: PluginSourceRoots,
): { value: string; rootKey?: keyof PluginSourceRoots } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = plugin.source;

  if (plugin.origin === "bundled" && roots.stock) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rel = tryRelative(roots.stock, raw);
    if (rel) {
      return { value: `stock:${rel}`, rootKey: "stock" };
    }
  }
  if (plugin.origin === "workspace" && roots.workspace) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rel = tryRelative(roots.workspace, raw);
    if (rel) {
      return { value: `workspace:${rel}`, rootKey: "workspace" };
    }
  }
  if (plugin.origin === "global" && roots.global) {
    const rel = tryRelative(roots.global, raw);
    if (rel) {
      return { value: `global:${rel}`, rootKey: "global" };
    }
  }

  // Keep this stable/pasteable; only ~-shorten.
  return { value: shortenHomeInString(raw) };
}
