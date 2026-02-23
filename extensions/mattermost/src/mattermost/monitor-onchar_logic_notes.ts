/*
 * AUTO ANNOTATION
 * File: extensions/mattermost/src/mattermost/monitor-onchar.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_ONCHAR_PREFIXES = [">", "!"];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveOncharPrefixes(prefixes: string[] | undefined): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = prefixes?.map((entry) => entry.trim()).filter(Boolean) ?? DEFAULT_ONCHAR_PREFIXES;
  return cleaned.length > 0 ? cleaned : DEFAULT_ONCHAR_PREFIXES;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripOncharPrefix(
  text: string,
  prefixes: string[],
): { triggered: boolean; stripped: string } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = text.trimStart();
  for (const prefix of prefixes) {
    if (!prefix) {
      continue;
    }
    if (trimmed.startsWith(prefix)) {
      return {
        triggered: true,
        stripped: trimmed.slice(prefix.length).trimStart(),
      };
    }
  }
  return { triggered: false, stripped: text };
}
