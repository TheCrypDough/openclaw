/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/attachments/remote-media.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getMSTeamsRuntime } from "../runtime.js";
import { inferPlaceholder } from "./shared.js";
import type { MSTeamsInboundMedia } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function downloadAndStoreMSTeamsRemoteMedia(params: {
  url: string;
  filePathHint: string;
  maxBytes: number;
  fetchImpl?: FetchLike;
  contentTypeHint?: string;
  placeholder?: string;
  preserveFilenames?: boolean;
}): Promise<MSTeamsInboundMedia> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fetched = await getMSTeamsRuntime().channel.media.fetchRemoteMedia({
    url: params.url,
    fetchImpl: params.fetchImpl,
    filePathHint: params.filePathHint,
    maxBytes: params.maxBytes,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mime = await getMSTeamsRuntime().media.detectMime({
    buffer: fetched.buffer,
    headerMime: fetched.contentType ?? params.contentTypeHint,
    filePath: params.filePathHint,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const originalFilename = params.preserveFilenames ? params.filePathHint : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const saved = await getMSTeamsRuntime().channel.media.saveMediaBuffer(
    fetched.buffer,
    mime ?? params.contentTypeHint,
    "inbound",
    params.maxBytes,
    originalFilename,
  );
  return {
    path: saved.path,
    contentType: saved.contentType,
    placeholder:
      params.placeholder ??
      inferPlaceholder({ contentType: saved.contentType, fileName: params.filePathHint }),
  };
}
