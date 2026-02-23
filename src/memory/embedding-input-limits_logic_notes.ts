/*
 * AUTO ANNOTATION
 * File: src/memory/embedding-input-limits.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
// Helpers for enforcing embedding model input size limits.
//
// We use UTF-8 byte length as a conservative upper bound for tokenizer output.
// Tokenizers operate over bytes; a token must contain at least one byte, so
// token_count <= utf8_byte_length.

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function estimateUtf8Bytes(text: string): number {
  if (!text) {
    return 0;
  }
  return Buffer.byteLength(text, "utf8");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function splitTextToUtf8ByteLimit(text: string, maxUtf8Bytes: number): string[] {
  if (maxUtf8Bytes <= 0) {
    return [text];
  }
  if (estimateUtf8Bytes(text) <= maxUtf8Bytes) {
    return [text];
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parts: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let cursor = 0;
  while (cursor < text.length) {
    // The number of UTF-16 code units is always <= the number of UTF-8 bytes.
    // This makes `cursor + maxUtf8Bytes` a safe upper bound on the next split point.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let low = cursor + 1;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let high = Math.min(text.length, cursor + maxUtf8Bytes);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let best = cursor;

    while (low <= high) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const mid = Math.floor((low + high) / 2);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const bytes = estimateUtf8Bytes(text.slice(cursor, mid));
      if (bytes <= maxUtf8Bytes) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    if (best <= cursor) {
      best = Math.min(text.length, cursor + 1);
    }

    // Avoid splitting inside a surrogate pair.
    if (
      best < text.length &&
      best > cursor &&
      text.charCodeAt(best - 1) >= 0xd800 &&
      text.charCodeAt(best - 1) <= 0xdbff &&
      text.charCodeAt(best) >= 0xdc00 &&
      text.charCodeAt(best) <= 0xdfff
    ) {
      best -= 1;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const part = text.slice(cursor, best);
    if (!part) {
      break;
    }
    parts.push(part);
    cursor = best;
  }

  return parts;
}
