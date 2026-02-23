/*
 * AUTO ANNOTATION
 * File: src/slack/monitor/events/channels.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { SlackEventMiddlewareArgs } from "@slack/bolt";
import { resolveChannelConfigWrites } from "../../../channels/plugins/config-writes.js";
import { loadConfig, writeConfigFile } from "../../../config/config.js";
import { danger, warn } from "../../../globals.js";
import { enqueueSystemEvent } from "../../../infra/system-events.js";
import { migrateSlackChannelConfig } from "../../channel-migration.js";
import { resolveSlackChannelLabel } from "../channel-config.js";
import type { SlackMonitorContext } from "../context.js";
import type {
  SlackChannelCreatedEvent,
  SlackChannelIdChangedEvent,
  SlackChannelRenamedEvent,
} from "../types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerSlackChannelEvents(params: { ctx: SlackMonitorContext }) {
  const { ctx } = params;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const enqueueChannelSystemEvent = (params: {
    kind: "created" | "renamed";
    channelId: string | undefined;
    channelName: string | undefined;
  }) => {
    if (
      !ctx.isChannelAllowed({
        channelId: params.channelId,
        channelName: params.channelName,
        channelType: "channel",
      })
    ) {
      return;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const label = resolveSlackChannelLabel({
      channelId: params.channelId,
      channelName: params.channelName,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sessionKey = ctx.resolveSlackSystemEventSessionKey({
      channelId: params.channelId,
      channelType: "channel",
    });
    enqueueSystemEvent(`Slack channel ${params.kind}: ${label}.`, {
      sessionKey,
      contextKey: `slack:channel:${params.kind}:${params.channelId ?? params.channelName ?? "unknown"}`,
    });
  };

  ctx.app.event(
    "channel_created",
    async ({ event, body }: SlackEventMiddlewareArgs<"channel_created">) => {
      try {
        if (ctx.shouldDropMismatchedSlackEvent(body)) {
          return;
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const payload = event as SlackChannelCreatedEvent;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const channelId = payload.channel?.id;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const channelName = payload.channel?.name;
        enqueueChannelSystemEvent({ kind: "created", channelId, channelName });
      } catch (err) {
        ctx.runtime.error?.(danger(`slack channel created handler failed: ${String(err)}`));
      }
    },
  );

  ctx.app.event(
    "channel_rename",
    async ({ event, body }: SlackEventMiddlewareArgs<"channel_rename">) => {
      try {
        if (ctx.shouldDropMismatchedSlackEvent(body)) {
          return;
        }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const payload = event as SlackChannelRenamedEvent;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const channelId = payload.channel?.id;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const channelName = payload.channel?.name_normalized ?? payload.channel?.name;
        enqueueChannelSystemEvent({ kind: "renamed", channelId, channelName });
      } catch (err) {
        ctx.runtime.error?.(danger(`slack channel rename handler failed: ${String(err)}`));
      }
    },
  );

  ctx.app.event(
    "channel_id_changed",
    async ({ event, body }: SlackEventMiddlewareArgs<"channel_id_changed">) => {
      try {
        if (ctx.shouldDropMismatchedSlackEvent(body)) {
          return;
        }

        const payload = event as SlackChannelIdChangedEvent;
        const oldChannelId = payload.old_channel_id;
        const newChannelId = payload.new_channel_id;
        if (!oldChannelId || !newChannelId) {
          return;
        }

        const channelInfo = await ctx.resolveChannelName(newChannelId);
        const label = resolveSlackChannelLabel({
          channelId: newChannelId,
          channelName: channelInfo?.name,
        });

        ctx.runtime.log?.(
          warn(`[slack] Channel ID changed: ${oldChannelId} → ${newChannelId} (${label})`),
        );

        if (
          !resolveChannelConfigWrites({
            cfg: ctx.cfg,
            channelId: "slack",
            accountId: ctx.accountId,
          })
        ) {
          ctx.runtime.log?.(
            warn("[slack] Config writes disabled; skipping channel config migration."),
          );
          return;
        }

        const currentConfig = loadConfig();
        const migration = migrateSlackChannelConfig({
          cfg: currentConfig,
          accountId: ctx.accountId,
          oldChannelId,
          newChannelId,
        });

        if (migration.migrated) {
          migrateSlackChannelConfig({
            cfg: ctx.cfg,
            accountId: ctx.accountId,
            oldChannelId,
            newChannelId,
          });
          await writeConfigFile(currentConfig);
          ctx.runtime.log?.(warn("[slack] Channel config migrated and saved successfully."));
        } else if (migration.skippedExisting) {
          ctx.runtime.log?.(
            warn(
              `[slack] Channel config already exists for ${newChannelId}; leaving ${oldChannelId} unchanged`,
            ),
          );
        } else {
          ctx.runtime.log?.(
            warn(
              `[slack] No config found for old channel ID ${oldChannelId}; migration logged only`,
            ),
          );
        }
      } catch (err) {
        ctx.runtime.error?.(danger(`slack channel_id_changed handler failed: ${String(err)}`));
      }
    },
  );
}
