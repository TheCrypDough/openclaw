/*
 * AUTO ANNOTATION
 * File: src/commands/health-format.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { colorize, isRich, theme } from "../terminal/theme.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const formatKv = (line: string, rich: boolean) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const idx = line.indexOf(": ");
  if (idx <= 0) {
    return colorize(rich, theme.muted, line);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = line.slice(0, idx);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const value = line.slice(idx + 2);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const valueColor =
    key === "Gateway target" || key === "Config"
      ? theme.command
      : key === "Source"
        ? theme.muted
        : theme.info;

  return `${colorize(rich, theme.muted, `${key}:`)} ${colorize(rich, valueColor, value)}`;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatHealthCheckFailure(err: unknown, opts: { rich?: boolean } = {}): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rich = opts.rich ?? isRich();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = String(err);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const message = err instanceof Error ? err.message : raw;

  if (!rich) {
    return `Health check failed: ${raw}`;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines = message
    .split("\n")
    .map((l) => l.trimEnd())
    .filter(Boolean);
  const detailsIdx = lines.findIndex((l) => l.startsWith("Gateway target: "));

  const summaryLines = (detailsIdx >= 0 ? lines.slice(0, detailsIdx) : lines)
    .map((l) => l.trim())
    .filter(Boolean);
  const detailLines = detailsIdx >= 0 ? lines.slice(detailsIdx) : [];

  const summary = summaryLines.length > 0 ? summaryLines.join(" ") : message;
  const header = colorize(rich, theme.error.bold, "Health check failed");

  const out: string[] = [`${header}: ${summary}`];
  for (const line of detailLines) {
    out.push(`  ${formatKv(line, rich)}`);
  }
  return out.join("\n");
}
