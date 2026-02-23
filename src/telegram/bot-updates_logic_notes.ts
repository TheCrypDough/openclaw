/*
 * AUTO ANNOTATION
 * File: src/telegram/bot-updates.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Message } from "@grammyjs/types";
import { createDedupeCache } from "../infra/dedupe.js";
import type { TelegramContext } from "./bot/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MEDIA_GROUP_TIMEOUT_MS = 500;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RECENT_TELEGRAM_UPDATE_TTL_MS = 5 * 60_000;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RECENT_TELEGRAM_UPDATE_MAX = 2000;

export type MediaGroupEntry = {
  messages: Array<{
    msg: Message;
    ctx: TelegramContext;
  }>;
  timer: ReturnType<typeof setTimeout>;
};

export type TelegramUpdateKeyContext = {
  update?: {
    update_id?: number;
    message?: Message;
    edited_message?: Message;
    channel_post?: Message;
    edited_channel_post?: Message;
  };
  update_id?: number;
  message?: Message;
  channelPost?: Message;
  editedChannelPost?: Message;
  callbackQuery?: { id?: string; message?: Message };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const resolveTelegramUpdateId = (ctx: TelegramUpdateKeyContext) =>
  ctx.update?.update_id ?? ctx.update_id;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const buildTelegramUpdateKey = (ctx: TelegramUpdateKeyContext) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const updateId = resolveTelegramUpdateId(ctx);
  if (typeof updateId === "number") {
    return `update:${updateId}`;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const callbackId = ctx.callbackQuery?.id;
  if (callbackId) {
    return `callback:${callbackId}`;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const msg =
    ctx.message ??
    ctx.channelPost ??
    ctx.editedChannelPost ??
    ctx.update?.message ??
    ctx.update?.edited_message ??
    ctx.update?.channel_post ??
    ctx.update?.edited_channel_post ??
    ctx.callbackQuery?.message;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const chatId = msg?.chat?.id;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const messageId = msg?.message_id;
  if (typeof chatId !== "undefined" && typeof messageId === "number") {
    return `message:${chatId}:${messageId}`;
  }
  return undefined;
};

export const createTelegramUpdateDedupe = () =>
  createDedupeCache({
    ttlMs: RECENT_TELEGRAM_UPDATE_TTL_MS,
    maxSize: RECENT_TELEGRAM_UPDATE_MAX,
  });

export { MEDIA_GROUP_TIMEOUT_MS };
