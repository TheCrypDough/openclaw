/*
 * AUTO ANNOTATION
 * File: src/slack/monitor/events/members.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { SlackEventMiddlewareArgs } from "@slack/bolt";
import { danger } from "../../../globals.js";
import { enqueueSystemEvent } from "../../../infra/system-events.js";
import { resolveSlackChannelLabel } from "../channel-config.js";
import type { SlackMonitorContext } from "../context.js";
import type { SlackMemberChannelEvent } from "../types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerSlackMemberEvents(params: { ctx: SlackMonitorContext }) {
  const { ctx } = params;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const handleMemberChannelEvent = async (params: {
    verb: "joined" | "left";
    event: SlackMemberChannelEvent;
    body: unknown;
  }) => {
    try {
      if (ctx.shouldDropMismatchedSlackEvent(params.body)) {
        return;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const payload = params.event;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const channelId = payload.channel;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const channelInfo = channelId ? await ctx.resolveChannelName(channelId) : {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const channelType = payload.channel_type ?? channelInfo?.type;
      if (
        !ctx.isChannelAllowed({
          channelId,
          channelName: channelInfo?.name,
          channelType,
        })
      ) {
        return;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const userInfo = payload.user ? await ctx.resolveUserName(payload.user) : {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const userLabel = userInfo?.name ?? payload.user ?? "someone";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const label = resolveSlackChannelLabel({
        channelId,
        channelName: channelInfo?.name,
      });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const sessionKey = ctx.resolveSlackSystemEventSessionKey({
        channelId,
        channelType,
      });
      enqueueSystemEvent(`Slack: ${userLabel} ${params.verb} ${label}.`, {
        sessionKey,
        contextKey: `slack:member:${params.verb}:${channelId ?? "unknown"}:${payload.user ?? "unknown"}`,
      });
    } catch (err) {
      ctx.runtime.error?.(danger(`slack ${params.verb} handler failed: ${String(err)}`));
    }
  };

  ctx.app.event(
    "member_joined_channel",
    async ({ event, body }: SlackEventMiddlewareArgs<"member_joined_channel">) => {
      await handleMemberChannelEvent({
        verb: "joined",
        event: event as SlackMemberChannelEvent,
        body,
      });
    },
  );

  ctx.app.event(
    "member_left_channel",
    async ({ event, body }: SlackEventMiddlewareArgs<"member_left_channel">) => {
      await handleMemberChannelEvent({
        verb: "left",
        event: event as SlackMemberChannelEvent,
        body,
      });
    },
  );
}
