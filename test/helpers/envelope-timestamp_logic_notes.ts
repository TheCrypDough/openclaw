/*
 * AUTO ANNOTATION
 * File: test/helpers/envelope-timestamp.ts
 * Purpose: Automated test for behavior validation (automated unit/e2e/live test suites).
 * Module area: Automated unit/e2e/live test suites
 * System effect: Affects confidence and CI coverage for system behavior, not production runtime by itself.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  formatUtcTimestamp,
  formatZonedTimestamp,
} from "../../src/infra/format-time/format-datetime.js";

export { escapeRegExp } from "../../src/utils.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type EnvelopeTimestampZone = string;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatEnvelopeTimestamp(date: Date, zone: EnvelopeTimestampZone = "utc"): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmedZone = zone.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = trimmedZone.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const weekday = (() => {
    try {
      if (normalized === "utc" || normalized === "gmt") {
        return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "short" }).format(date);
      }
      if (normalized === "local" || normalized === "host") {
        return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
      }
      return new Intl.DateTimeFormat("en-US", { timeZone: trimmedZone, weekday: "short" }).format(
        date,
      );
    } catch {
      return undefined;
    }
  })();

  if (normalized === "utc" || normalized === "gmt") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ts = formatUtcTimestamp(date);
    return weekday ? `${weekday} ${ts}` : ts;
  }
  if (normalized === "local" || normalized === "host") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ts = formatZonedTimestamp(date) ?? formatUtcTimestamp(date);
    return weekday ? `${weekday} ${ts}` : ts;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ts = formatZonedTimestamp(date, { timeZone: trimmedZone }) ?? formatUtcTimestamp(date);
  return weekday ? `${weekday} ${ts}` : ts;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatLocalEnvelopeTimestamp(date: Date): string {
  return formatEnvelopeTimestamp(date, "local");
}
