/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/text-chunking.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { chunkTextByBreakResolver } from "../shared/text-chunking.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function chunkTextForOutbound(text: string, limit: number): string[] {
  return chunkTextByBreakResolver(text, limit, (window) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lastNewline = window.lastIndexOf("\n");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const lastSpace = window.lastIndexOf(" ");
    return lastNewline > 0 ? lastNewline : lastSpace;
  });
}
