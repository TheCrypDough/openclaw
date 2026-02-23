/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/attachments/payload.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildMSTeamsMediaPayload(
  mediaList: Array<{ path: string; contentType?: string }>,
): {
  MediaPath?: string;
  MediaType?: string;
  MediaUrl?: string;
  MediaPaths?: string[];
  MediaUrls?: string[];
  MediaTypes?: string[];
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const first = mediaList[0];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mediaPaths = mediaList.map((media) => media.path);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mediaTypes = mediaList.map((media) => media.contentType ?? "");
  return {
    MediaPath: first?.path,
    MediaType: first?.contentType,
    MediaUrl: first?.path,
    MediaPaths: mediaPaths.length > 0 ? mediaPaths : undefined,
    MediaUrls: mediaPaths.length > 0 ? mediaPaths : undefined,
    MediaTypes: mediaPaths.length > 0 ? mediaTypes : undefined,
  };
}
