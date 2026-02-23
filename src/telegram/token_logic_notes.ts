/*
 * AUTO ANNOTATION
 * File: src/telegram/token.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import type { BaseTokenResolution } from "../channels/plugins/types.js";
import type { OpenClawConfig } from "../config/config.js";
import type { TelegramAccountConfig } from "../config/types.telegram.js";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "../routing/session-key.js";

export type TelegramTokenSource = "env" | "tokenFile" | "config" | "none";

export type TelegramTokenResolution = BaseTokenResolution & {
  source: TelegramTokenSource;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ResolveTelegramTokenOpts = {
  envToken?: string | null;
  accountId?: string | null;
  logMissingFile?: (message: string) => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveTelegramToken(
  cfg?: OpenClawConfig,
  opts: ResolveTelegramTokenOpts = {},
): TelegramTokenResolution {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = normalizeAccountId(opts.accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const telegramCfg = cfg?.channels?.telegram;

  // Account IDs are normalized for routing (e.g. lowercased). Config keys may not
  // be normalized, so resolve per-account config by matching normalized IDs.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolveAccountCfg = (id: string): TelegramAccountConfig | undefined => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const accounts = telegramCfg?.accounts;
    if (!accounts || typeof accounts !== "object" || Array.isArray(accounts)) {
      return undefined;
    }
    // Direct hit (already normalized key)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const direct = accounts[id];
    if (direct) {
      return direct;
    }
    // Fallback: match by normalized key
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const matchKey = Object.keys(accounts).find((key) => normalizeAccountId(key) === id);
    return matchKey ? accounts[matchKey] : undefined;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountCfg = resolveAccountCfg(
    accountId !== DEFAULT_ACCOUNT_ID ? accountId : DEFAULT_ACCOUNT_ID,
  );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountTokenFile = accountCfg?.tokenFile?.trim();
  if (accountTokenFile) {
    if (!fs.existsSync(accountTokenFile)) {
      opts.logMissingFile?.(
        `channels.telegram.accounts.${accountId}.tokenFile not found: ${accountTokenFile}`,
      );
      return { token: "", source: "none" };
    }
    try {
      const token = fs.readFileSync(accountTokenFile, "utf-8").trim();
      if (token) {
        return { token, source: "tokenFile" };
      }
    } catch (err) {
      opts.logMissingFile?.(
        `channels.telegram.accounts.${accountId}.tokenFile read failed: ${String(err)}`,
      );
      return { token: "", source: "none" };
    }
    return { token: "", source: "none" };
  }

  const accountToken = accountCfg?.botToken?.trim();
  if (accountToken) {
    return { token: accountToken, source: "config" };
  }

  const allowEnv = accountId === DEFAULT_ACCOUNT_ID;
  const tokenFile = telegramCfg?.tokenFile?.trim();
  if (tokenFile && allowEnv) {
    if (!fs.existsSync(tokenFile)) {
      opts.logMissingFile?.(`channels.telegram.tokenFile not found: ${tokenFile}`);
      return { token: "", source: "none" };
    }
    try {
      const token = fs.readFileSync(tokenFile, "utf-8").trim();
      if (token) {
        return { token, source: "tokenFile" };
      }
    } catch (err) {
      opts.logMissingFile?.(`channels.telegram.tokenFile read failed: ${String(err)}`);
      return { token: "", source: "none" };
    }
  }

  const configToken = telegramCfg?.botToken?.trim();
  if (configToken && allowEnv) {
    return { token: configToken, source: "config" };
  }

  const envToken = allowEnv ? (opts.envToken ?? process.env.TELEGRAM_BOT_TOKEN)?.trim() : "";
  if (envToken) {
    return { token: envToken, source: "env" };
  }

  return { token: "", source: "none" };
}
