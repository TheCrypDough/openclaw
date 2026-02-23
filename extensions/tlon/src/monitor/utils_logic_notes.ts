/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/monitor/utils.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeShip } from "../targets.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatModelName(modelString?: string | null): string {
  if (!modelString) {
    return "AI";
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const modelName = modelString.includes("/") ? modelString.split("/")[1] : modelString;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const modelMappings: Record<string, string> = {
    "claude-opus-4-6": "Claude Opus 4.6",
    "claude-opus-4-5": "Claude Opus 4.5",
    "claude-sonnet-4-5": "Claude Sonnet 4.5",
    "claude-sonnet-3-5": "Claude Sonnet 3.5",
    "gpt-4o": "GPT-4o",
    "gpt-4-turbo": "GPT-4 Turbo",
    "gpt-4": "GPT-4",
    "gemini-2.0-flash": "Gemini 2.0 Flash",
    "gemini-pro": "Gemini Pro",
  };

  if (modelMappings[modelName]) {
    return modelMappings[modelName];
  }
  return modelName
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isBotMentioned(messageText: string, botShipName: string): boolean {
  if (!messageText || !botShipName) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedBotShip = normalizeShip(botShipName);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const escapedShip = normalizedBotShip.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mentionPattern = new RegExp(`(^|\\s)${escapedShip}(?=\\s|$)`, "i");
  return mentionPattern.test(messageText);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isDmAllowed(senderShip: string, allowlist: string[] | undefined): boolean {
  if (!allowlist || allowlist.length === 0) {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedSender = normalizeShip(senderShip);
  return allowlist.map((ship) => normalizeShip(ship)).some((ship) => ship === normalizedSender);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function extractMessageText(content: unknown): string {
  if (!content || !Array.isArray(content)) {
    return "";
  }

  return (
    content
      // oxlint-disable-next-line typescript/no-explicit-any
      .map((block: any) => {
        if (block.inline && Array.isArray(block.inline)) {
          return (
            block.inline
              // oxlint-disable-next-line typescript/no-explicit-any
              .map((item: any) => {
                if (typeof item === "string") {
                  return item;
                }
                if (item && typeof item === "object") {
                  if (item.ship) {
                    return item.ship;
                  }
                  if (item.break !== undefined) {
                    return "\n";
                  }
                  if (item.link && item.link.href) {
                    return item.link.href;
                  }
                }
                return "";
              })
              .join("")
          );
        }
        return "";
      })
      .join("\n")
      .trim()
  );
}

export function isSummarizationRequest(messageText: string): boolean {
  const patterns = [
    /summarize\s+(this\s+)?(channel|chat|conversation)/i,
    /what\s+did\s+i\s+miss/i,
    /catch\s+me\s+up/i,
    /channel\s+summary/i,
    /tldr/i,
  ];
  return patterns.some((pattern) => pattern.test(messageText));
}

export function formatChangesDate(daysAgo = 5): string {
  const now = new Date();
  const targetDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  return `~${year}.${month}.${day}..20.19.51..9b9d`;
}
