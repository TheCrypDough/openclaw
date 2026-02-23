/*
 * AUTO ANNOTATION
 * File: ui/src/ui/chat/tool-helpers.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Helper functions for tool card rendering.
 */

import { PREVIEW_MAX_CHARS, PREVIEW_MAX_LINES } from "./constants.ts";

/**
 * Format tool output content for display in the sidebar.
 * Detects JSON and wraps it in a code block with formatting.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatToolOutputForSidebar(text: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = text.trim();
  // Try to detect and format JSON
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const parsed = JSON.parse(trimmed);
      return "```json\n" + JSON.stringify(parsed, null, 2) + "\n```";
    } catch {
      // Not valid JSON, return as-is
    }
  }
  return text;
}

/**
 * Get a truncated preview of tool output text.
 * Truncates to first N lines or first N characters, whichever is shorter.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getTruncatedPreview(text: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allLines = text.split("\n");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines = allLines.slice(0, PREVIEW_MAX_LINES);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const preview = lines.join("\n");
  if (preview.length > PREVIEW_MAX_CHARS) {
    return preview.slice(0, PREVIEW_MAX_CHARS) + "…";
  }
  return lines.length < allLines.length ? preview + "…" : preview;
}
