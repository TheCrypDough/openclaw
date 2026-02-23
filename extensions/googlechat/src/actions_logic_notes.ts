/*
 * AUTO ANNOTATION
 * File: extensions/googlechat/src/actions.ts
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
import {
  createActionGate,
  extractToolSend,
  jsonResult,
  readNumberParam,
  readReactionParams,
  readStringParam,
} from "openclaw/plugin-sdk";
import { listEnabledGoogleChatAccounts, resolveGoogleChatAccount } from "./accounts.js";
import {
  createGoogleChatReaction,
  deleteGoogleChatReaction,
  listGoogleChatReactions,
  sendGoogleChatMessage,
  uploadGoogleChatAttachment,
} from "./api.js";
import { getGoogleChatRuntime } from "./runtime.js";
import { resolveGoogleChatOutboundSpace } from "./targets.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const providerId = "googlechat";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function listEnabledAccounts(cfg: OpenClawConfig) {
  return listEnabledGoogleChatAccounts(cfg).filter(
    (account) => account.enabled && account.credentialSource !== "none",
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isReactionsEnabled(accounts: ReturnType<typeof listEnabledAccounts>, cfg: OpenClawConfig) {
  for (const account of accounts) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const gate = createActionGate(
      (account.config.actions ??
        (cfg.channels?.["googlechat"] as { actions?: unknown })?.actions) as Record<
        string,
        boolean | undefined
      >,
    );
    if (gate("reactions")) {
      return true;
    }
  }
  return false;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveAppUserNames(account: { config: { botUser?: string | null } }) {
  return new Set(["users/app", account.config.botUser?.trim()].filter(Boolean) as string[]);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const googlechatMessageActions: ChannelMessageActionAdapter = {
  listActions: ({ cfg }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const accounts = listEnabledAccounts(cfg);
    if (accounts.length === 0) {
      return [];
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const actions = new Set<ChannelMessageActionName>([]);
    actions.add("send");
    if (isReactionsEnabled(accounts, cfg)) {
      actions.add("react");
      actions.add("reactions");
    }
    return Array.from(actions);
  },
  extractToolSend: ({ args }) => {
    return extractToolSend(args, "sendMessage");
  },
  handleAction: async ({ action, params, cfg, accountId }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const account = resolveGoogleChatAccount({
      cfg: cfg,
      accountId,
    });
    if (account.credentialSource === "none") {
      throw new Error("Google Chat credentials are missing.");
    }

    if (action === "send") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const to = readStringParam(params, "to", { required: true });
      const content = readStringParam(params, "message", {
        required: true,
        allowEmpty: true,
      });
      const mediaUrl = readStringParam(params, "media", { trim: false });
      const threadId = readStringParam(params, "threadId") ?? readStringParam(params, "replyTo");
      const space = await resolveGoogleChatOutboundSpace({ account, target: to });

      if (mediaUrl) {
        const core = getGoogleChatRuntime();
        const maxBytes = (account.config.mediaMaxMb ?? 20) * 1024 * 1024;
        const loaded = await core.channel.media.fetchRemoteMedia({ url: mediaUrl, maxBytes });
        const upload = await uploadGoogleChatAttachment({
          account,
          space,
          filename: loaded.fileName ?? "attachment",
          buffer: loaded.buffer,
          contentType: loaded.contentType,
        });
        await sendGoogleChatMessage({
          account,
          space,
          text: content,
          thread: threadId ?? undefined,
          attachments: upload.attachmentUploadToken
            ? [
                {
                  attachmentUploadToken: upload.attachmentUploadToken,
                  contentName: loaded.fileName,
                },
              ]
            : undefined,
        });
        return jsonResult({ ok: true, to: space });
      }

      await sendGoogleChatMessage({
        account,
        space,
        text: content,
        thread: threadId ?? undefined,
      });
      return jsonResult({ ok: true, to: space });
    }

    if (action === "react") {
      const messageName = readStringParam(params, "messageId", { required: true });
      const { emoji, remove, isEmpty } = readReactionParams(params, {
        removeErrorMessage: "Emoji is required to remove a Google Chat reaction.",
      });
      if (remove || isEmpty) {
        const reactions = await listGoogleChatReactions({ account, messageName });
        const appUsers = resolveAppUserNames(account);
        const toRemove = reactions.filter((reaction) => {
          const userName = reaction.user?.name?.trim();
          if (appUsers.size > 0 && !appUsers.has(userName ?? "")) {
            return false;
          }
          if (emoji) {
            return reaction.emoji?.unicode === emoji;
          }
          return true;
        });
        for (const reaction of toRemove) {
          if (!reaction.name) {
            continue;
          }
          await deleteGoogleChatReaction({ account, reactionName: reaction.name });
        }
        return jsonResult({ ok: true, removed: toRemove.length });
      }
      const reaction = await createGoogleChatReaction({
        account,
        messageName,
        emoji,
      });
      return jsonResult({ ok: true, reaction });
    }

    if (action === "reactions") {
      const messageName = readStringParam(params, "messageId", { required: true });
      const limit = readNumberParam(params, "limit", { integer: true });
      const reactions = await listGoogleChatReactions({
        account,
        messageName,
        limit: limit ?? undefined,
      });
      return jsonResult({ ok: true, reactions });
    }

    throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
  },
};
