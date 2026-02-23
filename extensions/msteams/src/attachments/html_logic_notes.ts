/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/attachments/html.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  ATTACHMENT_TAG_RE,
  extractHtmlFromAttachment,
  extractInlineImageCandidates,
  IMG_SRC_RE,
  isLikelyImageAttachment,
  safeHostForUrl,
} from "./shared.js";
import type { MSTeamsAttachmentLike, MSTeamsHtmlAttachmentSummary } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function summarizeMSTeamsHtmlAttachments(
  attachments: MSTeamsAttachmentLike[] | undefined,
): MSTeamsHtmlAttachmentSummary | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const list = Array.isArray(attachments) ? attachments : [];
  if (list.length === 0) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let htmlAttachments = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let imgTags = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let dataImages = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let cidImages = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const srcHosts = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let attachmentTags = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const attachmentIds = new Set<string>();

  for (const att of list) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const html = extractHtmlFromAttachment(att);
    if (!html) {
      continue;
    }
    htmlAttachments += 1;
    IMG_SRC_RE.lastIndex = 0;
    let match: RegExpExecArray | null = IMG_SRC_RE.exec(html);
    while (match) {
      imgTags += 1;
      const src = match[1]?.trim();
      if (src) {
        if (src.startsWith("data:")) {
          dataImages += 1;
        } else if (src.startsWith("cid:")) {
          cidImages += 1;
        } else {
          srcHosts.add(safeHostForUrl(src));
        }
      }
      match = IMG_SRC_RE.exec(html);
    }

    ATTACHMENT_TAG_RE.lastIndex = 0;
    let attachmentMatch: RegExpExecArray | null = ATTACHMENT_TAG_RE.exec(html);
    while (attachmentMatch) {
      attachmentTags += 1;
      const id = attachmentMatch[1]?.trim();
      if (id) {
        attachmentIds.add(id);
      }
      attachmentMatch = ATTACHMENT_TAG_RE.exec(html);
    }
  }

  if (htmlAttachments === 0) {
    return undefined;
  }
  return {
    htmlAttachments,
    imgTags,
    dataImages,
    cidImages,
    srcHosts: Array.from(srcHosts).slice(0, 5),
    attachmentTags,
    attachmentIds: Array.from(attachmentIds).slice(0, 5),
  };
}

export function buildMSTeamsAttachmentPlaceholder(
  attachments: MSTeamsAttachmentLike[] | undefined,
): string {
  const list = Array.isArray(attachments) ? attachments : [];
  if (list.length === 0) {
    return "";
  }
  const imageCount = list.filter(isLikelyImageAttachment).length;
  const inlineCount = extractInlineImageCandidates(list).length;
  const totalImages = imageCount + inlineCount;
  if (totalImages > 0) {
    return `<media:image>${totalImages > 1 ? ` (${totalImages} images)` : ""}`;
  }
  const count = list.length;
  return `<media:document>${count > 1 ? ` (${count} files)` : ""}`;
}
