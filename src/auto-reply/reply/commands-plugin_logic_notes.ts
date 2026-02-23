/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-plugin.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Plugin Command Handler
 *
 * Handles commands registered by plugins, bypassing the LLM agent.
 * This handler is called before built-in command handlers.
 */

import { matchPluginCommand, executePluginCommand } from "../../plugins/commands.js";
import type { CommandHandler, CommandHandlerResult } from "./commands-types.js";

/**
 * Handle plugin-registered commands.
 * Returns a result if a plugin command was matched and executed,
 * or null to continue to the next handler.
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const handlePluginCommand: CommandHandler = async (
  params,
  allowTextCommands,
): Promise<CommandHandlerResult | null> => {
  const { command, cfg } = params;

  if (!allowTextCommands) {
    return null;
  }

  // Try to match a plugin command
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = matchPluginCommand(command.commandBodyNormalized);
  if (!match) {
    return null;
  }

  // Execute the plugin command (always returns a result)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = await executePluginCommand({
    command: match.command,
    args: match.args,
    senderId: command.senderId,
    channel: command.channel,
    channelId: command.channelId,
    isAuthorizedSender: command.isAuthorizedSender,
    commandBody: command.commandBodyNormalized,
    config: cfg,
    from: command.from,
    to: command.to,
    accountId: params.ctx.AccountId ?? undefined,
    messageThreadId:
      typeof params.ctx.MessageThreadId === "number" ? params.ctx.MessageThreadId : undefined,
  });

  return {
    shouldContinue: false,
    reply: result,
  };
};
