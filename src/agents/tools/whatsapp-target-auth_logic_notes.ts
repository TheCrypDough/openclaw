/*
 * AUTO ANNOTATION
 * File: src/agents/tools/whatsapp-target-auth.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../../config/config.js";
import { resolveWhatsAppAccount } from "../../web/accounts.js";
import { resolveWhatsAppOutboundTarget } from "../../whatsapp/resolve-outbound-target.js";
import { ToolAuthorizationError } from "./common.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveAuthorizedWhatsAppOutboundTarget(params: {
  cfg: OpenClawConfig;
  chatJid: string;
  accountId?: string;
  actionLabel: string;
}): { to: string; accountId: string } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveWhatsAppAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolution = resolveWhatsAppOutboundTarget({
    to: params.chatJid,
    allowFrom: account.allowFrom ?? [],
    mode: "implicit",
  });
  if (!resolution.ok) {
    throw new ToolAuthorizationError(
      `WhatsApp ${params.actionLabel} blocked: chatJid "${params.chatJid}" is not in the configured allowFrom list for account "${account.accountId}".`,
    );
  }
  return { to: resolution.to, accountId: account.accountId };
}
