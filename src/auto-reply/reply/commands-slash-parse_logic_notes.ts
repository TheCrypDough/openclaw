/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-slash-parse.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type SlashCommandParseResult =
  | { kind: "no-match" }
  | { kind: "empty" }
  | { kind: "invalid" }
  | { kind: "parsed"; action: string; args: string };

export type ParsedSlashCommand =
  | { ok: true; action: string; args: string }
  | { ok: false; message: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSlashCommandActionArgs(raw: string, slash: string): SlashCommandParseResult {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = raw.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const slashLower = slash.toLowerCase();
  if (!trimmed.toLowerCase().startsWith(slashLower)) {
    return { kind: "no-match" };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rest = trimmed.slice(slash.length).trim();
  if (!rest) {
    return { kind: "empty" };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = rest.match(/^(\S+)(?:\s+([\s\S]+))?$/);
  if (!match) {
    return { kind: "invalid" };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const action = match[1]?.toLowerCase() ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const args = (match[2] ?? "").trim();
  return { kind: "parsed", action, args };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSlashCommandOrNull(
  raw: string,
  slash: string,
  opts: { invalidMessage: string; defaultAction?: string },
): ParsedSlashCommand | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = parseSlashCommandActionArgs(raw, slash);
  if (parsed.kind === "no-match") {
    return null;
  }
  if (parsed.kind === "invalid") {
    return { ok: false, message: opts.invalidMessage };
  }
  if (parsed.kind === "empty") {
    return { ok: true, action: opts.defaultAction ?? "show", args: "" };
  }
  return { ok: true, action: parsed.action, args: parsed.args };
}
