/*
 * AUTO ANNOTATION
 * File: src/utils/shell-argv.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DOUBLE_QUOTE_ESCAPES = new Set(["\\", '"', "$", "`", "\n", "\r"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isDoubleQuoteEscape(next: string | undefined): next is string {
  return Boolean(next && DOUBLE_QUOTE_ESCAPES.has(next));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function splitShellArgs(raw: string): string[] | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tokens: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let buf = "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let inSingle = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let inDouble = false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let escaped = false;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pushToken = () => {
    if (buf.length > 0) {
      tokens.push(buf);
      buf = "";
    }
  };

  for (let i = 0; i < raw.length; i += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ch = raw[i];
    if (escaped) {
      buf += ch;
      escaped = false;
      continue;
    }
    if (!inSingle && !inDouble && ch === "\\") {
      escaped = true;
      continue;
    }
    if (inSingle) {
      if (ch === "'") {
        inSingle = false;
      } else {
        buf += ch;
      }
      continue;
    }
    if (inDouble) {
      const next = raw[i + 1];
      if (ch === "\\" && isDoubleQuoteEscape(next)) {
        buf += next;
        i += 1;
        continue;
      }
      if (ch === '"') {
        inDouble = false;
      } else {
        buf += ch;
      }
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      continue;
    }
    if (/\s/.test(ch)) {
      pushToken();
      continue;
    }
    buf += ch;
  }

  if (escaped || inSingle || inDouble) {
    return null;
  }
  pushToken();
  return tokens;
}
