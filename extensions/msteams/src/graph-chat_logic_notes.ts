/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/graph-chat.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Native Teams file card attachments for Bot Framework.
 *
 * The Bot Framework SDK supports `application/vnd.microsoft.teams.card.file.info`
 * content type which produces native Teams file cards.
 *
 * @see https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/bots-filesv4
 */

import type { DriveItemProperties } from "./graph-upload.js";

/**
 * Build a native Teams file card attachment for Bot Framework.
 *
 * This uses the `application/vnd.microsoft.teams.card.file.info` content type
 * which is supported by Bot Framework and produces native Teams file cards
 * (the same display as when a user manually shares a file).
 *
 * @param file - DriveItem properties from getDriveItemProperties()
 * @returns Attachment object for Bot Framework sendActivity()
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildTeamsFileInfoCard(file: DriveItemProperties): {
  contentType: string;
  contentUrl: string;
  name: string;
  content: {
    uniqueId: string;
    fileType: string;
  };
} {
  // Extract unique ID from eTag (remove quotes, braces, and version suffix)
  // Example eTag formats: "{GUID},version" or "\"{GUID},version\""
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rawETag = file.eTag;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const uniqueId =
    rawETag
      .replace(/^["']|["']$/g, "") // Remove outer quotes
      .replace(/[{}]/g, "") // Remove curly braces
      .split(",")[0] ?? rawETag; // Take the GUID part before comma

  // Extract file extension from filename
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lastDot = file.name.lastIndexOf(".");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fileType = lastDot >= 0 ? file.name.slice(lastDot + 1).toLowerCase() : "";

  return {
    contentType: "application/vnd.microsoft.teams.card.file.info",
    contentUrl: file.webDavUrl,
    name: file.name,
    content: {
      uniqueId,
      fileType,
    },
  };
}
