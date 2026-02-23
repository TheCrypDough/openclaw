/*
 * AUTO ANNOTATION
 * File: extensions/nextcloud-talk/src/format.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Format utilities for Nextcloud Talk messages.
 *
 * Nextcloud Talk supports markdown natively, so most formatting passes through.
 * This module handles any edge cases or transformations needed.
 */

/**
 * Convert markdown to Nextcloud Talk compatible format.
 * Nextcloud Talk supports standard markdown, so minimal transformation needed.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function markdownToNextcloudTalk(text: string): string {
  return text.trim();
}

/**
 * Escape special characters in text to prevent markdown interpretation.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function escapeNextcloudTalkMarkdown(text: string): string {
  return text.replace(/([*_`~[\]()#>+\-=|{}!\\])/g, "\\$1");
}

/**
 * Format a mention for a Nextcloud user.
 * Nextcloud Talk uses @user format for mentions.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatNextcloudTalkMention(userId: string): string {
  return `@${userId.replace(/^@/, "")}`;
}

/**
 * Format a code block for Nextcloud Talk.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatNextcloudTalkCodeBlock(code: string, language?: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lang = language ?? "";
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

/**
 * Format inline code for Nextcloud Talk.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatNextcloudTalkInlineCode(code: string): string {
  if (code.includes("`")) {
    return `\`\` ${code} \`\``;
  }
  return `\`${code}\``;
}

/**
 * Strip Nextcloud Talk specific formatting from text.
 * Useful for extracting plain text content.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripNextcloudTalkFormatting(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Truncate text to a maximum length, preserving word boundaries.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function truncateNextcloudTalkText(text: string, maxLength: number, suffix = "..."): string {
  if (text.length <= maxLength) {
    return text;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const truncated = text.slice(0, maxLength - suffix.length);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace) + suffix;
  }
  return truncated + suffix;
}
