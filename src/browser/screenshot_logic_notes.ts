/*
 * AUTO ANNOTATION
 * File: src/browser/screenshot.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  buildImageResizeSideGrid,
  getImageMetadata,
  IMAGE_REDUCE_QUALITY_STEPS,
  resizeToJpeg,
} from "../media/image-ops.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE = 2000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES = 5 * 1024 * 1024;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function normalizeBrowserScreenshot(
  buffer: Buffer,
  opts?: {
    maxSide?: number;
    maxBytes?: number;
  },
): Promise<{ buffer: Buffer; contentType?: "image/jpeg" }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxSide = Math.max(1, Math.round(opts?.maxSide ?? DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxBytes = Math.max(1, Math.round(opts?.maxBytes ?? DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const meta = await getImageMetadata(buffer);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const width = Number(meta?.width ?? 0);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const height = Number(meta?.height ?? 0);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const maxDim = Math.max(width, height);

  if (buffer.byteLength <= maxBytes && (maxDim === 0 || (width <= maxSide && height <= maxSide))) {
    return { buffer };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sideStart = maxDim > 0 ? Math.min(maxSide, maxDim) : maxSide;
  const sideGrid = buildImageResizeSideGrid(maxSide, sideStart);

  let smallest: { buffer: Buffer; size: number } | null = null;

  for (const side of sideGrid) {
    for (const quality of IMAGE_REDUCE_QUALITY_STEPS) {
      const out = await resizeToJpeg({
        buffer,
        maxSide: side,
        quality,
        withoutEnlargement: true,
      });

      if (!smallest || out.byteLength < smallest.size) {
        smallest = { buffer: out, size: out.byteLength };
      }

      if (out.byteLength <= maxBytes) {
        return { buffer: out, contentType: "image/jpeg" };
      }
    }
  }

  const best = smallest?.buffer ?? buffer;
  throw new Error(
    `Browser screenshot could not be reduced below ${(maxBytes / (1024 * 1024)).toFixed(0)}MB (got ${(best.byteLength / (1024 * 1024)).toFixed(2)}MB)`,
  );
}
