/*
 * AUTO ANNOTATION
 * File: src/markdown/whatsapp.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { escapeRegExp } from "../utils.js";
/**
 * Convert standard Markdown formatting to WhatsApp-compatible markup.
 *
 * WhatsApp uses its own formatting syntax:
 *   bold:          *text*
 *   italic:        _text_
 *   strikethrough: ~text~
 *   monospace:     ```text```
 *
 * Standard Markdown uses:
 *   bold:          **text** or __text__
 *   italic:        *text* or _text_
 *   strikethrough: ~~text~~
 *   code:          `text` (inline) or ```text``` (block)
 *
 * The conversion preserves fenced code blocks and inline code,
 * then converts bold and strikethrough markers.
 */

/** Placeholder tokens used during conversion to protect code spans. */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const FENCE_PLACEHOLDER = "\x00FENCE";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const INLINE_CODE_PLACEHOLDER = "\x00CODE";

/**
 * Convert standard Markdown bold/italic/strikethrough to WhatsApp formatting.
 *
 * Order of operations matters:
 * 1. Protect fenced code blocks (```...```) — already WhatsApp-compatible
 * 2. Protect inline code (`...`) — leave as-is
 * 3. Convert **bold** → *bold* and __bold__ → *bold*
 * 4. Convert ~~strike~~ → ~strike~
 * 5. Restore protected spans
 *
 * Italic *text* and _text_ are left alone since WhatsApp uses _text_ for italic
 * and single * is already WhatsApp bold — no conversion needed for single markers.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function markdownToWhatsApp(text: string): string {
  if (!text) {
    return text;
  }

  // 1. Extract and protect fenced code blocks
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fences: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let result = text.replace(/```[\s\S]*?```/g, (match) => {
    fences.push(match);
    return `${FENCE_PLACEHOLDER}${fences.length - 1}`;
  });

  // 2. Extract and protect inline code
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const inlineCodes: string[] = [];
  result = result.replace(/`[^`\n]+`/g, (match) => {
    inlineCodes.push(match);
    return `${INLINE_CODE_PLACEHOLDER}${inlineCodes.length - 1}`;
  });

  // 3. Convert **bold** → *bold* and __bold__ → *bold*
  result = result.replace(/\*\*(.+?)\*\*/g, "*$1*");
  result = result.replace(/__(.+?)__/g, "*$1*");

  // 4. Convert ~~strikethrough~~ → ~strikethrough~
  result = result.replace(/~~(.+?)~~/g, "~$1~");

  // 5. Restore inline code
  result = result.replace(
    new RegExp(`${escapeRegExp(INLINE_CODE_PLACEHOLDER)}(\\d+)`, "g"),
    (_, idx) => inlineCodes[Number(idx)] ?? "",
  );

  // 6. Restore fenced code blocks
  result = result.replace(
    new RegExp(`${escapeRegExp(FENCE_PLACEHOLDER)}(\\d+)`, "g"),
    (_, idx) => fences[Number(idx)] ?? "",
  );

  return result;
}
