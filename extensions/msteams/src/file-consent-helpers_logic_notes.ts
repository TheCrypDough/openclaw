/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/file-consent-helpers.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Shared helpers for FileConsentCard flow in MSTeams.
 *
 * FileConsentCard is required for:
 * - Personal (1:1) chats with large files (>=4MB)
 * - Personal chats with non-image files (PDFs, documents, etc.)
 *
 * This module consolidates the logic used by both send.ts (proactive sends)
 * and messenger.ts (reply path) to avoid duplication.
 */

import { buildFileConsentCard } from "./file-consent.js";
import { storePendingUpload } from "./pending-uploads.js";

export type FileConsentMedia = {
  buffer: Buffer;
  filename: string;
  contentType?: string;
};

export type FileConsentActivityResult = {
  activity: Record<string, unknown>;
  uploadId: string;
};

/**
 * Prepare a FileConsentCard activity for large files or non-images in personal chats.
 * Returns the activity object and uploadId - caller is responsible for sending.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function prepareFileConsentActivity(params: {
  media: FileConsentMedia;
  conversationId: string;
  description?: string;
}): FileConsentActivityResult {
  const { media, conversationId, description } = params;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const uploadId = storePendingUpload({
    buffer: media.buffer,
    filename: media.filename,
    contentType: media.contentType,
    conversationId,
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const consentCard = buildFileConsentCard({
    filename: media.filename,
    description: description || `File: ${media.filename}`,
    sizeInBytes: media.buffer.length,
    context: { uploadId },
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const activity: Record<string, unknown> = {
    type: "message",
    attachments: [consentCard],
  };

  return { activity, uploadId };
}

/**
 * Check if a file requires FileConsentCard flow.
 * True for: personal chat AND (large file OR non-image)
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function requiresFileConsent(params: {
  conversationType: string | undefined;
  contentType: string | undefined;
  bufferSize: number;
  thresholdBytes: number;
}): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isPersonal = params.conversationType?.toLowerCase() === "personal";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isImage = params.contentType?.startsWith("image/") ?? false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isLargeFile = params.bufferSize >= params.thresholdBytes;
  return isPersonal && (isLargeFile || !isImage);
}
