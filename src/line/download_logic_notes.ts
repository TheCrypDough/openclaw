/*
 * AUTO ANNOTATION
 * File: src/line/download.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import { messagingApi } from "@line/bot-sdk";
import { logVerbose } from "../globals.js";
import { buildRandomTempFilePath } from "../plugin-sdk/temp-path.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
interface DownloadResult {
  path: string;
  contentType?: string;
  size: number;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function downloadLineMedia(
  messageId: string,
  channelAccessToken: string,
  maxBytes = 10 * 1024 * 1024,
): Promise<DownloadResult> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const client = new messagingApi.MessagingApiBlobClient({
    channelAccessToken,
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const response = await client.getMessageContent(messageId);

  // response is a Readable stream
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chunks: Buffer[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let totalSize = 0;

  for await (const chunk of response as AsyncIterable<Buffer>) {
    totalSize += chunk.length;
    if (totalSize > maxBytes) {
      throw new Error(`Media exceeds ${Math.round(maxBytes / (1024 * 1024))}MB limit`);
    }
    chunks.push(chunk);
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const buffer = Buffer.concat(chunks);

  // Determine content type from magic bytes
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const contentType = detectContentType(buffer);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ext = getExtensionForContentType(contentType);

  // Use random temp names; never derive paths from external message identifiers.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const filePath = buildRandomTempFilePath({ prefix: "line-media", extension: ext });

  await fs.promises.writeFile(filePath, buffer);

  logVerbose(`line: downloaded media ${messageId} to ${filePath} (${buffer.length} bytes)`);

  return {
    path: filePath,
    contentType,
    size: buffer.length,
  };
}

function detectContentType(buffer: Buffer): string {
  // Check magic bytes
  if (buffer.length >= 2) {
    // JPEG
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      return "image/jpeg";
    }
    // PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      return "image/png";
    }
    // GIF
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
      return "image/gif";
    }
    // WebP
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    ) {
      return "image/webp";
    }
    // MP4
    if (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
      return "video/mp4";
    }
    // M4A/AAC
    if (buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0x00) {
      if (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
        return "audio/mp4";
      }
    }
  }

  return "application/octet-stream";
}

function getExtensionForContentType(contentType: string): string {
  switch (contentType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/gif":
      return ".gif";
    case "image/webp":
      return ".webp";
    case "video/mp4":
      return ".mp4";
    case "audio/mp4":
      return ".m4a";
    case "audio/mpeg":
      return ".mp3";
    default:
      return ".bin";
  }
}
