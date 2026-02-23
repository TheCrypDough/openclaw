/*
 * AUTO ANNOTATION
 * File: src/cli/program/message/register.emoji-sticker.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import { collectOption } from "../helpers.js";
import type { MessageCliHelpers } from "./helpers.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerMessageEmojiCommands(message: Command, helpers: MessageCliHelpers) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const emoji = message.command("emoji").description("Emoji actions");

  helpers
    .withMessageBase(emoji.command("list").description("List emojis"))
    .option("--guild-id <id>", "Guild id (Discord)")
    .action(async (opts) => {
      await helpers.runMessageAction("emoji-list", opts);
    });

  helpers
    .withMessageBase(
      emoji
        .command("upload")
        .description("Upload an emoji")
        .requiredOption("--guild-id <id>", "Guild id"),
    )
    .requiredOption("--emoji-name <name>", "Emoji name")
    .requiredOption("--media <path-or-url>", "Emoji media (path or URL)")
    .option("--role-ids <id>", "Role id (repeat)", collectOption, [] as string[])
    .action(async (opts) => {
      await helpers.runMessageAction("emoji-upload", opts);
    });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerMessageStickerCommands(message: Command, helpers: MessageCliHelpers) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sticker = message.command("sticker").description("Sticker actions");

  helpers
    .withMessageBase(
      helpers.withRequiredMessageTarget(sticker.command("send").description("Send stickers")),
    )
    .requiredOption("--sticker-id <id>", "Sticker id (repeat)", collectOption)
    .option("-m, --message <text>", "Optional message body")
    .action(async (opts) => {
      await helpers.runMessageAction("sticker", opts);
    });

  helpers
    .withMessageBase(
      sticker
        .command("upload")
        .description("Upload a sticker")
        .requiredOption("--guild-id <id>", "Guild id"),
    )
    .requiredOption("--sticker-name <name>", "Sticker name")
    .requiredOption("--sticker-desc <text>", "Sticker description")
    .requiredOption("--sticker-tags <tags>", "Sticker tags")
    .requiredOption("--media <path-or-url>", "Sticker media (path or URL)")
    .action(async (opts) => {
      await helpers.runMessageAction("sticker-upload", opts);
    });
}
