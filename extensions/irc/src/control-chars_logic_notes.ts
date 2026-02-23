/*
 * AUTO ANNOTATION
 * File: extensions/irc/src/control-chars.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isIrcControlChar(charCode: number): boolean {
  return charCode <= 0x1f || charCode === 0x7f;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function hasIrcControlChars(value: string): boolean {
  for (const char of value) {
    if (isIrcControlChar(char.charCodeAt(0))) {
      return true;
    }
  }
  return false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripIrcControlChars(value: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let out = "";
  for (const char of value) {
    if (!isIrcControlChar(char.charCodeAt(0))) {
      out += char;
    }
  }
  return out;
}
