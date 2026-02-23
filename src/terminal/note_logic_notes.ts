/*
 * AUTO ANNOTATION
 * File: src/terminal/note.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { note as clackNote } from "@clack/prompts";
import { visibleWidth } from "./ansi.js";
import { stylePromptTitle } from "./prompt-style.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const URL_PREFIX_RE = /^(https?:\/\/|file:\/\/)/i;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const WINDOWS_DRIVE_RE = /^[a-zA-Z]:[\\/]/;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const FILE_LIKE_RE = /^[a-zA-Z0-9._-]+$/;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function splitLongWord(word: string, maxLen: number): string[] {
  if (maxLen <= 0) {
    return [word];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chars = Array.from(word);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parts: string[] = [];
  for (let i = 0; i < chars.length; i += maxLen) {
    parts.push(chars.slice(i, i + maxLen).join(""));
  }
  return parts.length > 0 ? parts : [word];
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isCopySensitiveToken(word: string): boolean {
  if (!word) {
    return false;
  }
  if (URL_PREFIX_RE.test(word)) {
    return true;
  }
  if (
    word.startsWith("/") ||
    word.startsWith("~/") ||
    word.startsWith("./") ||
    word.startsWith("../")
  ) {
    return true;
  }
  if (WINDOWS_DRIVE_RE.test(word) || word.startsWith("\\\\")) {
    return true;
  }
  if (word.includes("/") || word.includes("\\")) {
    return true;
  }
  // Preserve common file-like tokens (for example administrators_authorized_keys).
  return word.includes("_") && FILE_LIKE_RE.test(word);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function wrapLine(line: string, maxWidth: number): string[] {
  if (line.trim().length === 0) {
    return [line];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = line.match(/^(\s*)([-*\u2022]\s+)?(.*)$/);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const indent = match?.[1] ?? "";
  const bullet = match?.[2] ?? "";
  const content = match?.[3] ?? "";
  const firstPrefix = `${indent}${bullet}`;
  const nextPrefix = `${indent}${bullet ? " ".repeat(bullet.length) : ""}`;
  const firstWidth = Math.max(10, maxWidth - visibleWidth(firstPrefix));
  const nextWidth = Math.max(10, maxWidth - visibleWidth(nextPrefix));

  const words = content.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  let prefix = firstPrefix;
  let available = firstWidth;

  for (const word of words) {
    if (!current) {
      if (visibleWidth(word) > available) {
        if (isCopySensitiveToken(word)) {
          current = word;
          continue;
        }
        const parts = splitLongWord(word, available);
        const first = parts.shift() ?? "";
        lines.push(prefix + first);
        prefix = nextPrefix;
        available = nextWidth;
        for (const part of parts) {
          lines.push(prefix + part);
        }
        continue;
      }
      current = word;
      continue;
    }

    const candidate = `${current} ${word}`;
    if (visibleWidth(candidate) <= available) {
      current = candidate;
      continue;
    }

    lines.push(prefix + current);
    prefix = nextPrefix;
    available = nextWidth;

    if (visibleWidth(word) > available) {
      if (isCopySensitiveToken(word)) {
        current = word;
        continue;
      }
      const parts = splitLongWord(word, available);
      const first = parts.shift() ?? "";
      lines.push(prefix + first);
      for (const part of parts) {
        lines.push(prefix + part);
      }
      current = "";
      continue;
    }
    current = word;
  }

  if (current || words.length === 0) {
    lines.push(prefix + current);
  }

  return lines;
}

export function wrapNoteMessage(
  message: string,
  options: { maxWidth?: number; columns?: number } = {},
): string {
  const columns = options.columns ?? process.stdout.columns ?? 80;
  const maxWidth = options.maxWidth ?? Math.max(40, Math.min(88, columns - 10));
  return message
    .split("\n")
    .flatMap((line) => wrapLine(line, maxWidth))
    .join("\n");
}

export function note(message: string, title?: string) {
  clackNote(wrapNoteMessage(message), stylePromptTitle(title));
}
