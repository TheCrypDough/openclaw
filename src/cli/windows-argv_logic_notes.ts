/*
 * AUTO ANNOTATION
 * File: src/cli/windows-argv.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeWindowsArgv(argv: string[]): string[] {
  if (process.platform !== "win32") {
    return argv;
  }
  if (argv.length < 2) {
    return argv;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stripControlChars = (value: string): string => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let out = "";
    for (let i = 0; i < value.length; i += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const code = value.charCodeAt(i);
      if (code >= 32 && code !== 127) {
        out += value[i];
      }
    }
    return out;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizeArg = (value: string): string =>
    stripControlChars(value)
      .replace(/^['"]+|['"]+$/g, "")
      .trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizeCandidate = (value: string): string =>
    normalizeArg(value).replace(/^\\\\\\?\\/, "");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const execPath = normalizeCandidate(process.execPath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const execPathLower = execPath.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const execBase = path.basename(execPath).toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isExecPath = (value: string | undefined): boolean => {
    if (!value) {
      return false;
    }
    const normalized = normalizeCandidate(value);
    if (!normalized) {
      return false;
    }
    const lower = normalized.toLowerCase();
    return (
      lower === execPathLower ||
      path.basename(lower) === execBase ||
      lower.endsWith("\\node.exe") ||
      lower.endsWith("/node.exe") ||
      lower.includes("node.exe") ||
      (path.basename(lower) === "node.exe" && fs.existsSync(normalized))
    );
  };

  const next = [...argv];
  for (let i = 1; i <= 3 && i < next.length; ) {
    if (isExecPath(next[i])) {
      next.splice(i, 1);
      continue;
    }
    i += 1;
  }
  const filtered = next.filter((arg, index) => index === 0 || !isExecPath(arg));
  if (filtered.length < 3) {
    return filtered;
  }
  const cleaned = [...filtered];
  for (let i = 2; i < cleaned.length; ) {
    const arg = cleaned[i];
    if (!arg || arg.startsWith("-")) {
      i += 1;
      continue;
    }
    if (isExecPath(arg)) {
      cleaned.splice(i, 1);
      continue;
    }
    break;
  }
  return cleaned;
}
