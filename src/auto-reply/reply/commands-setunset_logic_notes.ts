/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-setunset.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { parseSlashCommandOrNull } from "./commands-slash-parse.js";
import { parseConfigValue } from "./config-value.js";

export type SetUnsetParseResult =
  | { kind: "set"; path: string; value: unknown }
  | { kind: "unset"; path: string }
  | { kind: "error"; message: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSetUnsetCommand(params: {
  slash: string;
  action: "set" | "unset";
  args: string;
}): SetUnsetParseResult {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const action = params.action;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const args = params.args.trim();
  if (action === "unset") {
    if (!args) {
      return { kind: "error", message: `Usage: ${params.slash} unset path` };
    }
    return { kind: "unset", path: args };
  }
  if (!args) {
    return { kind: "error", message: `Usage: ${params.slash} set path=value` };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const eqIndex = args.indexOf("=");
  if (eqIndex <= 0) {
    return { kind: "error", message: `Usage: ${params.slash} set path=value` };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const path = args.slice(0, eqIndex).trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rawValue = args.slice(eqIndex + 1);
  if (!path) {
    return { kind: "error", message: `Usage: ${params.slash} set path=value` };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = parseConfigValue(rawValue);
  if (parsed.error) {
    return { kind: "error", message: parsed.error };
  }
  return { kind: "set", path, value: parsed.value };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSetUnsetCommandAction<T>(params: {
  slash: string;
  action: string;
  args: string;
  onSet: (path: string, value: unknown) => T;
  onUnset: (path: string) => T;
  onError: (message: string) => T;
}): T | null {
  if (params.action !== "set" && params.action !== "unset") {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = parseSetUnsetCommand({
    slash: params.slash,
    action: params.action,
    args: params.args,
  });
  if (parsed.kind === "error") {
    return params.onError(parsed.message);
  }
  return parsed.kind === "set"
    ? params.onSet(parsed.path, parsed.value)
    : params.onUnset(parsed.path);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSlashCommandWithSetUnset<T>(params: {
  raw: string;
  slash: string;
  invalidMessage: string;
  usageMessage: string;
  onKnownAction: (action: string, args: string) => T | undefined;
  onSet: (path: string, value: unknown) => T;
  onUnset: (path: string) => T;
  onError: (message: string) => T;
}): T | null {
  const parsed = parseSlashCommandOrNull(params.raw, params.slash, {
    invalidMessage: params.invalidMessage,
  });
  if (!parsed) {
    return null;
  }
  if (!parsed.ok) {
    return params.onError(parsed.message);
  }
  const { action, args } = parsed;
  const setUnset = parseSetUnsetCommandAction<T>({
    slash: params.slash,
    action,
    args,
    onSet: params.onSet,
    onUnset: params.onUnset,
    onError: params.onError,
  });
  if (setUnset) {
    return setUnset;
  }
  const knownAction = params.onKnownAction(action, args);
  if (knownAction) {
    return knownAction;
  }
  return params.onError(params.usageMessage);
}
