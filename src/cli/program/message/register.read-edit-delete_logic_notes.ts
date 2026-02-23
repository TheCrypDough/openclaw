/*
 * AUTO ANNOTATION
 * File: src/cli/program/message/register.read-edit-delete.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import type { MessageCliHelpers } from "./helpers.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerMessageReadEditDeleteCommands(
  message: Command,
  helpers: MessageCliHelpers,
) {
  helpers
    .withMessageBase(
      helpers.withRequiredMessageTarget(
        message.command("read").description("Read recent messages"),
      ),
    )
    .option("--limit <n>", "Result limit")
    .option("--before <id>", "Read/search before id")
    .option("--after <id>", "Read/search after id")
    .option("--around <id>", "Read around id")
    .option("--include-thread", "Include thread replies (Discord)", false)
    .action(async (opts) => {
      await helpers.runMessageAction("read", opts);
    });

  helpers
    .withMessageBase(
      helpers.withRequiredMessageTarget(
        message
          .command("edit")
          .description("Edit a message")
          .requiredOption("--message-id <id>", "Message id")
          .requiredOption("-m, --message <text>", "Message body"),
      ),
    )
    .option("--thread-id <id>", "Thread id (Telegram forum thread)")
    .action(async (opts) => {
      await helpers.runMessageAction("edit", opts);
    });

  helpers
    .withMessageBase(
      helpers.withRequiredMessageTarget(
        message
          .command("delete")
          .description("Delete a message")
          .requiredOption("--message-id <id>", "Message id"),
      ),
    )
    .action(async (opts) => {
      await helpers.runMessageAction("delete", opts);
    });
}
