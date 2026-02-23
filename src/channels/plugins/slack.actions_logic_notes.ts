/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/slack.actions.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { handleSlackAction, type SlackActionContext } from "../../agents/tools/slack-actions.js";
import { handleSlackMessageAction } from "../../plugin-sdk/slack-message-actions.js";
import { extractSlackToolSend, listSlackMessageActions } from "../../slack/message-actions.js";
import { resolveSlackChannelId } from "../../slack/targets.js";
import type { ChannelMessageActionAdapter } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createSlackActions(providerId: string): ChannelMessageActionAdapter {
  return {
    listActions: ({ cfg }) => listSlackMessageActions(cfg),
    extractToolSend: ({ args }) => extractSlackToolSend(args),
    handleAction: async (ctx) => {
      return await handleSlackMessageAction({
        providerId,
        ctx,
        normalizeChannelId: resolveSlackChannelId,
        includeReadThreadId: true,
        invoke: async (action, cfg, toolContext) =>
          await handleSlackAction(action, cfg, toolContext as SlackActionContext | undefined),
      });
    },
  };
}
