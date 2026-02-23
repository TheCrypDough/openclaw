/*
 * AUTO ANNOTATION
 * File: src/shared/entry-metadata.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveEmojiAndHomepage(params: {
  metadata?: { emoji?: string; homepage?: string } | null;
  frontmatter?: {
    emoji?: string;
    homepage?: string;
    website?: string;
    url?: string;
  } | null;
}): { emoji?: string; homepage?: string } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const emoji = params.metadata?.emoji ?? params.frontmatter?.emoji;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const homepageRaw =
    params.metadata?.homepage ??
    params.frontmatter?.homepage ??
    params.frontmatter?.website ??
    params.frontmatter?.url;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const homepage = homepageRaw?.trim() ? homepageRaw.trim() : undefined;
  return { ...(emoji ? { emoji } : {}), ...(homepage ? { homepage } : {}) };
}
