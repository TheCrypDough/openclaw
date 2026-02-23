/*
 * AUTO ANNOTATION
 * File: src/daemon/cmd-set.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type CmdSetAssignment = { key: string; value: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function assertNoCmdLineBreak(value: string, field: string): void {
  if (/[\r\n]/.test(value)) {
    throw new Error(`${field} cannot contain CR or LF in Windows task scripts.`);
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function escapeCmdSetAssignmentComponent(value: string): string {
  return value.replace(/\^/g, "^^").replace(/%/g, "%%").replace(/!/g, "^!").replace(/"/g, '^"');
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function unescapeCmdSetAssignmentComponent(value: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let out = "";
  for (let i = 0; i < value.length; i += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ch = value[i];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const next = value[i + 1];
    if (ch === "^" && (next === "^" || next === '"' || next === "!")) {
      out += next;
      i += 1;
      continue;
    }
    if (ch === "%" && next === "%") {
      out += "%";
      i += 1;
      continue;
    }
    out += ch;
  }
  return out;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseCmdSetAssignment(line: string): CmdSetAssignment | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = line.trim();
  if (!raw) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const quoted = raw.startsWith('"') && raw.endsWith('"') && raw.length >= 2;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const assignment = quoted ? raw.slice(1, -1) : raw;
  const index = assignment.indexOf("=");
  if (index <= 0) {
    return null;
  }
  const key = assignment.slice(0, index).trim();
  const value = assignment.slice(index + 1).trim();
  if (!key) {
    return null;
  }
  if (!quoted) {
    return { key, value };
  }
  return {
    key: unescapeCmdSetAssignmentComponent(key),
    value: unescapeCmdSetAssignmentComponent(value),
  };
}

export function renderCmdSetAssignment(key: string, value: string): string {
  assertNoCmdLineBreak(key, "Environment variable name");
  assertNoCmdLineBreak(value, "Environment variable value");
  const escapedKey = escapeCmdSetAssignmentComponent(key);
  const escapedValue = escapeCmdSetAssignmentComponent(value);
  return `set "${escapedKey}=${escapedValue}"`;
}
