# AUTOPLACEHOLDER_ANNOTATION: extensions/feishu/src/tools-config.ts
# Purpose: Extension package component that adds a channel/tool integration or adapter.
# Area: Pluggable channel and service extensions
# System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
import type { FeishuToolsConfig } from "./types.js";

/**
 * Default tool configuration.
 * - doc, wiki, drive, scopes: enabled by default
 * - perm: disabled by default (sensitive operation)
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_TOOLS_CONFIG: Required<FeishuToolsConfig> = {
  doc: true,
  wiki: true,
  drive: true,
  perm: false,
  scopes: true,
};

/**
 * Resolve tools config with defaults.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveToolsConfig(cfg?: FeishuToolsConfig): Required<FeishuToolsConfig> {
  return { ...DEFAULT_TOOLS_CONFIG, ...cfg };
}
