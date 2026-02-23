/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/reply-inline.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const INLINE_SIMPLE_COMMAND_ALIASES = new Map<string, string>([
  ["/help", "/help"],
  ["/commands", "/commands"],
  ["/whoami", "/whoami"],
  ["/id", "/whoami"],
]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const INLINE_SIMPLE_COMMAND_RE = /(?:^|\s)\/(help|commands|whoami|id)(?=$|\s|:)/i;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const INLINE_STATUS_RE = /(?:^|\s)\/status(?=$|\s|:)(?:\s*:\s*)?/gi;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractInlineSimpleCommand(body?: string): {
  command: string;
  cleaned: string;
} | null {
  if (!body) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = body.match(INLINE_SIMPLE_COMMAND_RE);
  if (!match || match.index === undefined) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const alias = `/${match[1].toLowerCase()}`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const command = INLINE_SIMPLE_COMMAND_ALIASES.get(alias);
  if (!command) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cleaned = body.replace(match[0], " ").replace(/\s+/g, " ").trim();
  return { command, cleaned };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripInlineStatus(body: string): {
  cleaned: string;
  didStrip: boolean;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = body.trim();
  if (!trimmed) {
    return { cleaned: "", didStrip: false };
  }
  const cleaned = trimmed.replace(INLINE_STATUS_RE, " ").replace(/\s+/g, " ").trim();
  return { cleaned, didStrip: cleaned !== trimmed };
}
