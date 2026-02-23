/*
 * AUTO ANNOTATION
 * File: src/media/base64.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function estimateBase64DecodedBytes(base64: string): number {
  // Avoid `trim()`/`replace()` here: they allocate a second (potentially huge) string.
  // We only need a conservative decoded-size estimate to enforce budgets before Buffer.from(..., "base64").
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let effectiveLen = 0;
  for (let i = 0; i < base64.length; i += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const code = base64.charCodeAt(i);
    // Treat ASCII control + space as whitespace; base64 decoders commonly ignore these.
    if (code <= 0x20) {
      continue;
    }
    effectiveLen += 1;
  }

  if (effectiveLen === 0) {
    return 0;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let padding = 0;
  // Find last non-whitespace char(s) to detect '=' padding without allocating/copying.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let end = base64.length - 1;
  while (end >= 0 && base64.charCodeAt(end) <= 0x20) {
    end -= 1;
  }
  if (end >= 0 && base64[end] === "=") {
    padding = 1;
    end -= 1;
    while (end >= 0 && base64.charCodeAt(end) <= 0x20) {
      end -= 1;
    }
    if (end >= 0 && base64[end] === "=") {
      padding = 2;
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const estimated = Math.floor((effectiveLen * 3) / 4) - padding;
  return Math.max(0, estimated);
}
