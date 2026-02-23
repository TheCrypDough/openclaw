/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/client/runtime.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isBunRuntime(): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const versions = process.versions as { bun?: string };
  return typeof versions.bun === "string";
}
