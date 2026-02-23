/*
 * AUTO ANNOTATION
 * File: src/discord/send.emojis-stickers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Routes } from "discord-api-types/v10";
import { loadWebMediaRaw } from "../web/media.js";
import { normalizeEmojiName, resolveDiscordRest } from "./send.shared.js";
import type { DiscordEmojiUpload, DiscordReactOpts, DiscordStickerUpload } from "./send.types.js";
import { DISCORD_MAX_EMOJI_BYTES, DISCORD_MAX_STICKER_BYTES } from "./send.types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function listGuildEmojisDiscord(guildId: string, opts: DiscordReactOpts = {}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rest = resolveDiscordRest(opts);
  return await rest.get(Routes.guildEmojis(guildId));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function uploadEmojiDiscord(payload: DiscordEmojiUpload, opts: DiscordReactOpts = {}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rest = resolveDiscordRest(opts);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const media = await loadWebMediaRaw(payload.mediaUrl, DISCORD_MAX_EMOJI_BYTES);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const contentType = media.contentType?.toLowerCase();
  if (
    !contentType ||
    !["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(contentType)
  ) {
    throw new Error("Discord emoji uploads require a PNG, JPG, or GIF image");
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const image = `data:${contentType};base64,${media.buffer.toString("base64")}`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const roleIds = (payload.roleIds ?? []).map((id) => id.trim()).filter(Boolean);
  return await rest.post(Routes.guildEmojis(payload.guildId), {
    body: {
      name: normalizeEmojiName(payload.name, "Emoji name"),
      image,
      roles: roleIds.length ? roleIds : undefined,
    },
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function uploadStickerDiscord(
  payload: DiscordStickerUpload,
  opts: DiscordReactOpts = {},
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rest = resolveDiscordRest(opts);
  const media = await loadWebMediaRaw(payload.mediaUrl, DISCORD_MAX_STICKER_BYTES);
  const contentType = media.contentType?.toLowerCase();
  if (!contentType || !["image/png", "image/apng", "application/json"].includes(contentType)) {
    throw new Error("Discord sticker uploads require a PNG, APNG, or Lottie JSON file");
  }
  return await rest.post(Routes.guildStickers(payload.guildId), {
    body: {
      name: normalizeEmojiName(payload.name, "Sticker name"),
      description: normalizeEmojiName(payload.description, "Sticker description"),
      tags: normalizeEmojiName(payload.tags, "Sticker tags"),
      files: [
        {
          data: media.buffer,
          name: media.fileName ?? "sticker",
          contentType,
        },
      ],
    },
  });
}
