/*
 * AUTO ANNOTATION
 * File: src/agents/tools/whatsapp-actions.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import type { OpenClawConfig } from "../../config/config.js";
import { sendReactionWhatsApp } from "../../web/outbound.js";
import { createActionGate, jsonResult, readReactionParams, readStringParam } from "./common.js";
import { resolveAuthorizedWhatsAppOutboundTarget } from "./whatsapp-target-auth.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function handleWhatsAppAction(
  params: Record<string, unknown>,
  cfg: OpenClawConfig,
): Promise<AgentToolResult<unknown>> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const action = readStringParam(params, "action", { required: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isActionEnabled = createActionGate(cfg.channels?.whatsapp?.actions);

  if (action === "react") {
    if (!isActionEnabled("reactions")) {
      throw new Error("WhatsApp reactions are disabled.");
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const chatJid = readStringParam(params, "chatJid", { required: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const messageId = readStringParam(params, "messageId", { required: true });
    const { emoji, remove, isEmpty } = readReactionParams(params, {
      removeErrorMessage: "Emoji is required to remove a WhatsApp reaction.",
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const participant = readStringParam(params, "participant");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const accountId = readStringParam(params, "accountId");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fromMeRaw = params.fromMe;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fromMe = typeof fromMeRaw === "boolean" ? fromMeRaw : undefined;

    // Resolve account + allowFrom via shared account logic so auth and routing stay aligned.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = resolveAuthorizedWhatsAppOutboundTarget({
      cfg,
      chatJid,
      accountId,
      actionLabel: "reaction",
    });

    const resolvedEmoji = remove ? "" : emoji;
    await sendReactionWhatsApp(resolved.to, messageId, resolvedEmoji, {
      verbose: false,
      fromMe,
      participant: participant ?? undefined,
      accountId: resolved.accountId,
    });
    if (!remove && !isEmpty) {
      return jsonResult({ ok: true, added: emoji });
    }
    return jsonResult({ ok: true, removed: true });
  }

  throw new Error(`Unsupported WhatsApp action: ${action}`);
}
