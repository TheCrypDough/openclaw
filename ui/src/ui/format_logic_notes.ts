/*
 * AUTO ANNOTATION
 * File: ui/src/ui/format.ts
 * Purpose: UI source/configuration for one of OpenClaw frontend surfaces.
 * Module area: Web UI package and frontend runtime
 * System effect: Changes impact interaction layer and operator experience.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { formatDurationHuman } from "../../../src/infra/format-time/format-duration.ts";
import { formatRelativeTimestamp } from "../../../src/infra/format-time/format-relative.ts";
import { stripReasoningTagsFromText } from "../../../src/shared/text/reasoning-tags.js";

export { formatRelativeTimestamp, formatDurationHuman };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatMs(ms?: number | null): string {
  if (!ms && ms !== 0) {
    return "n/a";
  }
  return new Date(ms).toLocaleString();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatList(values?: Array<string | null | undefined>): string {
  if (!values || values.length === 0) {
    return "none";
  }
  return values.filter((v): v is string => Boolean(v && v.trim())).join(", ");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function clampText(value: string, max = 120): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, Math.max(0, max - 1))}…`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function truncateText(
  value: string,
  max: number,
): {
  text: string;
  truncated: boolean;
  total: number;
} {
  if (value.length <= max) {
    return { text: value, truncated: false, total: value.length };
  }
  return {
    text: value.slice(0, Math.max(0, max)),
    truncated: true,
    total: value.length,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function toNumber(value: string, fallback: number): number {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseList(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripThinkingTags(value: string): string {
  return stripReasoningTagsFromText(value, { mode: "preserve", trim: "start" });
}
