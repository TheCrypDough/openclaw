/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/slack-message-actions.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import { readNumberParam, readStringParam } from "../agents/tools/common.js";
import type { ChannelMessageActionContext } from "../channels/plugins/types.js";
import { parseSlackBlocksInput } from "../slack/blocks-input.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SlackActionInvoke = (
  action: Record<string, unknown>,
  cfg: ChannelMessageActionContext["cfg"],
  toolContext?: ChannelMessageActionContext["toolContext"],
) => Promise<AgentToolResult<unknown>>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function readSlackBlocksParam(actionParams: Record<string, unknown>) {
  return parseSlackBlocksInput(actionParams.blocks) as Record<string, unknown>[] | undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function handleSlackMessageAction(params: {
  providerId: string;
  ctx: ChannelMessageActionContext;
  invoke: SlackActionInvoke;
  normalizeChannelId?: (channelId: string) => string;
  includeReadThreadId?: boolean;
}): Promise<AgentToolResult<unknown>> {
  const { providerId, ctx, invoke, normalizeChannelId, includeReadThreadId = false } = params;
  const { action, cfg, params: actionParams } = ctx;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = ctx.accountId ?? undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolveChannelId = () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const channelId =
      readStringParam(actionParams, "channelId") ??
      readStringParam(actionParams, "to", { required: true });
    return normalizeChannelId ? normalizeChannelId(channelId) : channelId;
  };

  if (action === "send") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const to = readStringParam(actionParams, "to", { required: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const content = readStringParam(actionParams, "message", {
      required: false,
      allowEmpty: true,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mediaUrl = readStringParam(actionParams, "media", { trim: false });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const blocks = readSlackBlocksParam(actionParams);
    if (!content && !mediaUrl && !blocks) {
      throw new Error("Slack send requires message, blocks, or media.");
    }
    if (mediaUrl && blocks) {
      throw new Error("Slack send does not support blocks with media.");
    }
    const threadId = readStringParam(actionParams, "threadId");
    const replyTo = readStringParam(actionParams, "replyTo");
    return await invoke(
      {
        action: "sendMessage",
        to,
        content: content ?? "",
        mediaUrl: mediaUrl ?? undefined,
        blocks,
        accountId,
        threadTs: threadId ?? replyTo ?? undefined,
      },
      cfg,
      ctx.toolContext,
    );
  }

  if (action === "react") {
    const messageId = readStringParam(actionParams, "messageId", {
      required: true,
    });
    const emoji = readStringParam(actionParams, "emoji", { allowEmpty: true });
    const remove = typeof actionParams.remove === "boolean" ? actionParams.remove : undefined;
    return await invoke(
      {
        action: "react",
        channelId: resolveChannelId(),
        messageId,
        emoji,
        remove,
        accountId,
      },
      cfg,
    );
  }

  if (action === "reactions") {
    const messageId = readStringParam(actionParams, "messageId", {
      required: true,
    });
    const limit = readNumberParam(actionParams, "limit", { integer: true });
    return await invoke(
      {
        action: "reactions",
        channelId: resolveChannelId(),
        messageId,
        limit,
        accountId,
      },
      cfg,
    );
  }

  if (action === "read") {
    const limit = readNumberParam(actionParams, "limit", { integer: true });
    const readAction: Record<string, unknown> = {
      action: "readMessages",
      channelId: resolveChannelId(),
      limit,
      before: readStringParam(actionParams, "before"),
      after: readStringParam(actionParams, "after"),
      accountId,
    };
    if (includeReadThreadId) {
      readAction.threadId = readStringParam(actionParams, "threadId");
    }
    return await invoke(readAction, cfg);
  }

  if (action === "edit") {
    const messageId = readStringParam(actionParams, "messageId", {
      required: true,
    });
    const content = readStringParam(actionParams, "message", { allowEmpty: true });
    const blocks = readSlackBlocksParam(actionParams);
    if (!content && !blocks) {
      throw new Error("Slack edit requires message or blocks.");
    }
    return await invoke(
      {
        action: "editMessage",
        channelId: resolveChannelId(),
        messageId,
        content: content ?? "",
        blocks,
        accountId,
      },
      cfg,
    );
  }

  if (action === "delete") {
    const messageId = readStringParam(actionParams, "messageId", {
      required: true,
    });
    return await invoke(
      {
        action: "deleteMessage",
        channelId: resolveChannelId(),
        messageId,
        accountId,
      },
      cfg,
    );
  }

  if (action === "pin" || action === "unpin" || action === "list-pins") {
    const messageId =
      action === "list-pins"
        ? undefined
        : readStringParam(actionParams, "messageId", { required: true });
    return await invoke(
      {
        action: action === "pin" ? "pinMessage" : action === "unpin" ? "unpinMessage" : "listPins",
        channelId: resolveChannelId(),
        messageId,
        accountId,
      },
      cfg,
    );
  }

  if (action === "member-info") {
    const userId = readStringParam(actionParams, "userId", { required: true });
    return await invoke({ action: "memberInfo", userId, accountId }, cfg);
  }

  if (action === "emoji-list") {
    const limit = readNumberParam(actionParams, "limit", { integer: true });
    return await invoke({ action: "emojiList", limit, accountId }, cfg);
  }

  throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
}
