/*
 * AUTO ANNOTATION
 * File: src/memory/qmd-query-parser.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createSubsystemLogger } from "../logging/subsystem.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("memory");

export type QmdQueryResult = {
  docid?: string;
  score?: number;
  collection?: string;
  file?: string;
  snippet?: string;
  body?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseQmdQueryJson(stdout: string, stderr: string): QmdQueryResult[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmedStdout = stdout.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmedStderr = stderr.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stdoutIsMarker = trimmedStdout.length > 0 && isQmdNoResultsOutput(trimmedStdout);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stderrIsMarker = trimmedStderr.length > 0 && isQmdNoResultsOutput(trimmedStderr);
  if (stdoutIsMarker || (!trimmedStdout && stderrIsMarker)) {
    return [];
  }
  if (!trimmedStdout) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const context = trimmedStderr ? ` (stderr: ${summarizeQmdStderr(trimmedStderr)})` : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = `stdout empty${context}`;
    log.warn(`qmd query returned invalid JSON: ${message}`);
    throw new Error(`qmd query returned invalid JSON: ${message}`);
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = parseQmdQueryResultArray(trimmedStdout);
    if (parsed !== null) {
      return parsed;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const noisyPayload = extractFirstJsonArray(trimmedStdout);
    if (!noisyPayload) {
      throw new Error("qmd query JSON response was not an array");
    }
    const fallback = parseQmdQueryResultArray(noisyPayload);
    if (fallback !== null) {
      return fallback;
    }
    throw new Error("qmd query JSON response was not an array");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.warn(`qmd query returned invalid JSON: ${message}`);
    throw new Error(`qmd query returned invalid JSON: ${message}`, { cause: err });
  }
}

function isQmdNoResultsOutput(raw: string): boolean {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim().toLowerCase().replace(/\s+/g, " "))
    .filter((line) => line.length > 0);
  return lines.some((line) => isQmdNoResultsLine(line));
}

function isQmdNoResultsLine(line: string): boolean {
  if (line === "no results found" || line === "no results found.") {
    return true;
  }
  return /^(?:\[[^\]]+\]\s*)?(?:(?:warn(?:ing)?|info|error|qmd)\s*:\s*)+no results found\.?$/.test(
    line,
  );
}

function summarizeQmdStderr(raw: string): string {
  return raw.length <= 120 ? raw : `${raw.slice(0, 117)}...`;
}

function parseQmdQueryResultArray(raw: string): QmdQueryResult[] | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed as QmdQueryResult[];
  } catch {
    return null;
  }
}

function extractFirstJsonArray(raw: string): string | null {
  const start = raw.indexOf("[");
  if (start < 0) {
    return null;
  }
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < raw.length; i += 1) {
    const char = raw[i];
    if (char === undefined) {
      break;
    }
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        return raw.slice(start, i + 1);
      }
    }
  }
  return null;
}
