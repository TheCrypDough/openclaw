/*
 * AUTO ANNOTATION
 * File: src/agents/tools/discord-actions-moderation.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import type { DiscordActionConfig } from "../../config/config.js";
import {
  banMemberDiscord,
  hasAnyGuildPermissionDiscord,
  kickMemberDiscord,
  timeoutMemberDiscord,
} from "../../discord/send.js";
import { type ActionGate, jsonResult, readStringParam } from "./common.js";
import {
  isDiscordModerationAction,
  readDiscordModerationCommand,
  requiredGuildPermissionForModerationAction,
} from "./discord-actions-moderation-shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function verifySenderModerationPermission(params: {
  guildId: string;
  senderUserId?: string;
  requiredPermission: bigint;
  accountId?: string;
}) {
  // CLI/manual flows may not have sender context; enforce only when present.
  if (!params.senderUserId) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasPermission = await hasAnyGuildPermissionDiscord(
    params.guildId,
    params.senderUserId,
    [params.requiredPermission],
    params.accountId ? { accountId: params.accountId } : undefined,
  );
  if (!hasPermission) {
    throw new Error("Sender does not have required permissions for this moderation action.");
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function handleDiscordModerationAction(
  action: string,
  params: Record<string, unknown>,
  isActionEnabled: ActionGate<DiscordActionConfig>,
): Promise<AgentToolResult<unknown>> {
  if (!isDiscordModerationAction(action)) {
    throw new Error(`Unknown action: ${action}`);
  }
  if (!isActionEnabled("moderation", false)) {
    throw new Error("Discord moderation is disabled.");
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const command = readDiscordModerationCommand(action, params);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = readStringParam(params, "accountId");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const senderUserId = readStringParam(params, "senderUserId");
  await verifySenderModerationPermission({
    guildId: command.guildId,
    senderUserId,
    requiredPermission: requiredGuildPermissionForModerationAction(command.action),
    accountId,
  });
  switch (command.action) {
    case "timeout": {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const member = accountId
        ? await timeoutMemberDiscord(
            {
              guildId: command.guildId,
              userId: command.userId,
              durationMinutes: command.durationMinutes,
              until: command.until,
              reason: command.reason,
            },
            { accountId },
          )
        : await timeoutMemberDiscord({
            guildId: command.guildId,
            userId: command.userId,
            durationMinutes: command.durationMinutes,
            until: command.until,
            reason: command.reason,
          });
      return jsonResult({ ok: true, member });
    }
    case "kick": {
      if (accountId) {
        await kickMemberDiscord(
          {
            guildId: command.guildId,
            userId: command.userId,
            reason: command.reason,
          },
          { accountId },
        );
      } else {
        await kickMemberDiscord({
          guildId: command.guildId,
          userId: command.userId,
          reason: command.reason,
        });
      }
      return jsonResult({ ok: true });
    }
    case "ban": {
      if (accountId) {
        await banMemberDiscord(
          {
            guildId: command.guildId,
            userId: command.userId,
            reason: command.reason,
            deleteMessageDays: command.deleteMessageDays,
          },
          { accountId },
        );
      } else {
        await banMemberDiscord({
          guildId: command.guildId,
          userId: command.userId,
          reason: command.reason,
          deleteMessageDays: command.deleteMessageDays,
        });
      }
      return jsonResult({ ok: true });
    }
  }
}
