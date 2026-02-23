/*
 * AUTO ANNOTATION
 * File: src/auto-reply/command-detection.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/types.js";
import {
  type CommandNormalizeOptions,
  listChatCommands,
  listChatCommandsForConfig,
  normalizeCommandBody,
} from "./commands-registry.js";
import { isAbortTrigger } from "./reply/abort.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function hasControlCommand(
  text?: string,
  cfg?: OpenClawConfig,
  options?: CommandNormalizeOptions,
): boolean {
  if (!text) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedBody = normalizeCommandBody(trimmed, options);
  if (!normalizedBody) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lowered = normalizedBody.toLowerCase();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const commands = cfg ? listChatCommandsForConfig(cfg) : listChatCommands();
  for (const command of commands) {
    for (const alias of command.textAliases) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const normalized = alias.trim().toLowerCase();
      if (!normalized) {
        continue;
      }
      if (lowered === normalized) {
        return true;
      }
      if (command.acceptsArgs && lowered.startsWith(normalized)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const nextChar = normalizedBody.charAt(normalized.length);
        if (nextChar && /\s/.test(nextChar)) {
          return true;
        }
      }
    }
  }
  return false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isControlCommandMessage(
  text?: string,
  cfg?: OpenClawConfig,
  options?: CommandNormalizeOptions,
): boolean {
  if (!text) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }
  if (hasControlCommand(trimmed, cfg, options)) {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeCommandBody(trimmed, options).trim().toLowerCase();
  return isAbortTrigger(normalized);
}

/**
 * Coarse detection for inline directives/shortcuts (e.g. "hey /status") so channel monitors
 * can decide whether to compute CommandAuthorized for a message.
 *
 * This intentionally errs on the side of false positives; CommandAuthorized only gates
 * command/directive execution, not normal chat replies.
 */
export function hasInlineCommandTokens(text?: string): boolean {
  const body = text ?? "";
  if (!body.trim()) {
    return false;
  }
  return /(?:^|\s)[/!][a-z]/i.test(body);
}

export function shouldComputeCommandAuthorized(
  text?: string,
  cfg?: OpenClawConfig,
  options?: CommandNormalizeOptions,
): boolean {
  return isControlCommandMessage(text, cfg, options) || hasInlineCommandTokens(text);
}
