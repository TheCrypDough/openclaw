/*
 * AUTO ANNOTATION
 * File: src/telegram/inline-buttons.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import type { TelegramInlineButtonsScope } from "../config/types.telegram.js";
import { listTelegramAccountIds, resolveTelegramAccount } from "./accounts.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_INLINE_BUTTONS_SCOPE: TelegramInlineButtonsScope = "allowlist";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeInlineButtonsScope(value: unknown): TelegramInlineButtonsScope | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim().toLowerCase();
  if (
    trimmed === "off" ||
    trimmed === "dm" ||
    trimmed === "group" ||
    trimmed === "all" ||
    trimmed === "allowlist"
  ) {
    return trimmed as TelegramInlineButtonsScope;
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveInlineButtonsScopeFromCapabilities(
  capabilities: unknown,
): TelegramInlineButtonsScope {
  if (!capabilities) {
    return DEFAULT_INLINE_BUTTONS_SCOPE;
  }
  if (Array.isArray(capabilities)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const enabled = capabilities.some(
      (entry) => String(entry).trim().toLowerCase() === "inlinebuttons",
    );
    return enabled ? "all" : "off";
  }
  if (typeof capabilities === "object") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const inlineButtons = (capabilities as { inlineButtons?: unknown }).inlineButtons;
    return normalizeInlineButtonsScope(inlineButtons) ?? DEFAULT_INLINE_BUTTONS_SCOPE;
  }
  return DEFAULT_INLINE_BUTTONS_SCOPE;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveTelegramInlineButtonsScope(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): TelegramInlineButtonsScope {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveTelegramAccount({ cfg: params.cfg, accountId: params.accountId });
  return resolveInlineButtonsScopeFromCapabilities(account.config.capabilities);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isTelegramInlineButtonsEnabled(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): boolean {
  if (params.accountId) {
    return resolveTelegramInlineButtonsScope(params) !== "off";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountIds = listTelegramAccountIds(params.cfg);
  if (accountIds.length === 0) {
    return resolveTelegramInlineButtonsScope(params) !== "off";
  }
  return accountIds.some(
    (accountId) => resolveTelegramInlineButtonsScope({ cfg: params.cfg, accountId }) !== "off",
  );
}

export { resolveTelegramTargetChatType } from "./targets.js";
