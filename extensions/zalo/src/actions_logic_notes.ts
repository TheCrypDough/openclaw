/*
 * AUTO ANNOTATION
 * File: extensions/zalo/src/actions.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type {
  ChannelMessageActionAdapter,
  ChannelMessageActionName,
  OpenClawConfig,
} from "openclaw/plugin-sdk";
import { jsonResult, readStringParam } from "openclaw/plugin-sdk";
import { listEnabledZaloAccounts } from "./accounts.js";
import { sendMessageZalo } from "./send.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const providerId = "zalo";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function listEnabledAccounts(cfg: OpenClawConfig) {
  return listEnabledZaloAccounts(cfg).filter(
    (account) => account.enabled && account.tokenSource !== "none",
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const zaloMessageActions: ChannelMessageActionAdapter = {
  listActions: ({ cfg }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const accounts = listEnabledAccounts(cfg);
    if (accounts.length === 0) {
      return [];
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const actions = new Set<ChannelMessageActionName>(["send"]);
    return Array.from(actions);
  },
  supportsButtons: () => false,
  extractToolSend: ({ args }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const action = typeof args.action === "string" ? args.action.trim() : "";
    if (action !== "sendMessage") {
      return null;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const to = typeof args.to === "string" ? args.to : undefined;
    if (!to) {
      return null;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const accountId = typeof args.accountId === "string" ? args.accountId.trim() : undefined;
    return { to, accountId };
  },
  handleAction: async ({ action, params, cfg, accountId }) => {
    if (action === "send") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const to = readStringParam(params, "to", { required: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const content = readStringParam(params, "message", {
        required: true,
        allowEmpty: true,
      });
      const mediaUrl = readStringParam(params, "media", { trim: false });

      const result = await sendMessageZalo(to ?? "", content ?? "", {
        accountId: accountId ?? undefined,
        mediaUrl: mediaUrl ?? undefined,
        cfg: cfg,
      });

      if (!result.ok) {
        return jsonResult({
          ok: false,
          error: result.error ?? "Failed to send Zalo message",
        });
      }

      return jsonResult({ ok: true, to, messageId: result.messageId });
    }

    throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
  },
};
