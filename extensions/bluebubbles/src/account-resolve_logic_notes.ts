/*
 * AUTO ANNOTATION
 * File: extensions/bluebubbles/src/account-resolve.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "openclaw/plugin-sdk";
import { resolveBlueBubblesAccount } from "./accounts.js";

export type BlueBubblesAccountResolveOpts = {
  serverUrl?: string;
  password?: string;
  accountId?: string;
  cfg?: OpenClawConfig;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveBlueBubblesServerAccount(params: BlueBubblesAccountResolveOpts): {
  baseUrl: string;
  password: string;
  accountId: string;
} {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveBlueBubblesAccount({
    cfg: params.cfg ?? {},
    accountId: params.accountId,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseUrl = params.serverUrl?.trim() || account.config.serverUrl?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const password = params.password?.trim() || account.config.password?.trim();
  if (!baseUrl) {
    throw new Error("BlueBubbles serverUrl is required");
  }
  if (!password) {
    throw new Error("BlueBubbles password is required");
  }
  return { baseUrl, password, accountId: account.accountId };
}
