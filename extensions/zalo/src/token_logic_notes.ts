/*
 * AUTO ANNOTATION
 * File: extensions/zalo/src/token.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { readFileSync } from "node:fs";
import { type BaseTokenResolution, DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk";
import type { ZaloConfig } from "./types.js";

export type ZaloTokenResolution = BaseTokenResolution & {
  source: "env" | "config" | "configFile" | "none";
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveZaloToken(
  config: ZaloConfig | undefined,
  accountId?: string | null,
): ZaloTokenResolution {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedAccountId = accountId ?? DEFAULT_ACCOUNT_ID;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isDefaultAccount = resolvedAccountId === DEFAULT_ACCOUNT_ID;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseConfig = config;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountConfig =
    resolvedAccountId !== DEFAULT_ACCOUNT_ID
      ? (baseConfig?.accounts?.[resolvedAccountId] as ZaloConfig | undefined)
      : undefined;

  if (accountConfig) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const token = accountConfig.botToken?.trim();
    if (token) {
      return { token, source: "config" };
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tokenFile = accountConfig.tokenFile?.trim();
    if (tokenFile) {
      try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const fileToken = readFileSync(tokenFile, "utf8").trim();
        if (fileToken) {
          return { token: fileToken, source: "configFile" };
        }
      } catch {
        // ignore read failures
      }
    }
  }

  if (isDefaultAccount) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const token = baseConfig?.botToken?.trim();
    if (token) {
      return { token, source: "config" };
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tokenFile = baseConfig?.tokenFile?.trim();
    if (tokenFile) {
      try {
        const fileToken = readFileSync(tokenFile, "utf8").trim();
        if (fileToken) {
          return { token: fileToken, source: "configFile" };
        }
      } catch {
        // ignore read failures
      }
    }
    const envToken = process.env.ZALO_BOT_TOKEN?.trim();
    if (envToken) {
      return { token: envToken, source: "env" };
    }
  }

  return { token: "", source: "none" };
}
