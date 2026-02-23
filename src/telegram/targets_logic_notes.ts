/*
 * AUTO ANNOTATION
 * File: src/telegram/targets.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type TelegramTarget = {
  chatId: string;
  messageThreadId?: number;
  chatType: "direct" | "group" | "unknown";
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function stripTelegramInternalPrefixes(to: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let trimmed = to.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let strippedTelegramPrefix = false;
  while (true) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const next = (() => {
      if (/^(telegram|tg):/i.test(trimmed)) {
        strippedTelegramPrefix = true;
        return trimmed.replace(/^(telegram|tg):/i, "").trim();
      }
      // Legacy internal form: `telegram:group:<id>` (still emitted by session keys).
      if (strippedTelegramPrefix && /^group:/i.test(trimmed)) {
        return trimmed.replace(/^group:/i, "").trim();
      }
      return trimmed;
    })();
    if (next === trimmed) {
      return trimmed;
    }
    trimmed = next;
  }
}

/**
 * Parse a Telegram delivery target into chatId and optional topic/thread ID.
 *
 * Supported formats:
 * - `chatId` (plain chat ID, t.me link, @username, or internal prefixes like `telegram:...`)
 * - `chatId:topicId` (numeric topic/thread ID)
 * - `chatId:topic:topicId` (explicit topic marker; preferred)
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveTelegramChatType(chatId: string): "direct" | "group" | "unknown" {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = chatId.trim();
  if (!trimmed) {
    return "unknown";
  }
  if (/^-?\d+$/.test(trimmed)) {
    return trimmed.startsWith("-") ? "group" : "direct";
  }
  return "unknown";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseTelegramTarget(to: string): TelegramTarget {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = stripTelegramInternalPrefixes(to);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const topicMatch = /^(.+?):topic:(\d+)$/.exec(normalized);
  if (topicMatch) {
    return {
      chatId: topicMatch[1],
      messageThreadId: Number.parseInt(topicMatch[2], 10),
      chatType: resolveTelegramChatType(topicMatch[1]),
    };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const colonMatch = /^(.+):(\d+)$/.exec(normalized);
  if (colonMatch) {
    return {
      chatId: colonMatch[1],
      messageThreadId: Number.parseInt(colonMatch[2], 10),
      chatType: resolveTelegramChatType(colonMatch[1]),
    };
  }

  return {
    chatId: normalized,
    chatType: resolveTelegramChatType(normalized),
  };
}

export function resolveTelegramTargetChatType(target: string): "direct" | "group" | "unknown" {
  return parseTelegramTarget(target).chatType;
}
