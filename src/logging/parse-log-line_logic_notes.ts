/*
 * AUTO ANNOTATION
 * File: src/logging/parse-log-line.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type ParsedLogLine = {
  time?: string;
  level?: string;
  subsystem?: string;
  module?: string;
  message: string;
  raw: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function extractMessage(value: Record<string, unknown>): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parts: string[] = [];
  for (const key of Object.keys(value)) {
    if (!/^\d+$/.test(key)) {
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const item = value[key];
    if (typeof item === "string") {
      parts.push(item);
    } else if (item != null) {
      parts.push(JSON.stringify(item));
    }
  }
  return parts.join(" ");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseMetaName(raw?: unknown): { subsystem?: string; module?: string } {
  if (typeof raw !== "string") {
    return {};
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      subsystem: typeof parsed.subsystem === "string" ? parsed.subsystem : undefined,
      module: typeof parsed.module === "string" ? parsed.module : undefined,
    };
  } catch {
    return {};
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseLogLine(raw: string): ParsedLogLine | null {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON.parse(raw) as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const meta = parsed._meta as Record<string, unknown> | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const nameMeta = parseMetaName(meta?.name);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const levelRaw = typeof meta?.logLevelName === "string" ? meta.logLevelName : undefined;
    return {
      time:
        typeof parsed.time === "string"
          ? parsed.time
          : typeof meta?.date === "string"
            ? meta.date
            : undefined,
      level: levelRaw ? levelRaw.toLowerCase() : undefined,
      subsystem: nameMeta.subsystem,
      module: nameMeta.module,
      message: extractMessage(parsed),
      raw,
    };
  } catch {
    return null;
  }
}
