/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/attachments.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export {
  downloadMSTeamsAttachments,
  /** @deprecated Use `downloadMSTeamsAttachments` instead. */
  downloadMSTeamsImageAttachments,
} from "./attachments/download.js";
export { buildMSTeamsGraphMessageUrls, downloadMSTeamsGraphMedia } from "./attachments/graph.js";
export {
  buildMSTeamsAttachmentPlaceholder,
  summarizeMSTeamsHtmlAttachments,
} from "./attachments/html.js";
export { buildMSTeamsMediaPayload } from "./attachments/payload.js";
export type {
  MSTeamsAccessTokenProvider,
  MSTeamsAttachmentLike,
  MSTeamsGraphMediaResult,
  MSTeamsHtmlAttachmentSummary,
  MSTeamsInboundMedia,
} from "./attachments/types.js";
