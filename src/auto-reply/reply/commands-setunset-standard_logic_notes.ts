/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-setunset-standard.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { parseSlashCommandWithSetUnset } from "./commands-setunset.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseStandardSetUnsetSlashCommand<T>(params: {
  raw: string;
  slash: string;
  invalidMessage: string;
  usageMessage: string;
  onKnownAction: (action: string, args: string) => T | undefined;
  onSet?: (path: string, value: unknown) => T;
  onUnset?: (path: string) => T;
  onError?: (message: string) => T;
}): T | null {
  return parseSlashCommandWithSetUnset<T>({
    raw: params.raw,
    slash: params.slash,
    invalidMessage: params.invalidMessage,
    usageMessage: params.usageMessage,
    onKnownAction: params.onKnownAction,
    onSet: params.onSet ?? ((path, value) => ({ action: "set", path, value }) as T),
    onUnset: params.onUnset ?? ((path) => ({ action: "unset", path }) as T),
    onError: params.onError ?? ((message) => ({ action: "error", message }) as T),
  });
}
