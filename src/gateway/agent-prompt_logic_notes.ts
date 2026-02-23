/*
 * AUTO ANNOTATION
 * File: src/gateway/agent-prompt.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { buildHistoryContextFromEntries, type HistoryEntry } from "../auto-reply/reply/history.js";

export type ConversationEntry = {
  role: "user" | "assistant" | "tool";
  entry: HistoryEntry;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildAgentMessageFromConversationEntries(entries: ConversationEntry[]): string {
  if (entries.length === 0) {
    return "";
  }

  // Prefer the last user/tool entry as "current message" so the agent responds to
  // the latest user input or tool output, not the assistant's previous message.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let currentIndex = -1;
  for (let i = entries.length - 1; i >= 0; i -= 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const role = entries[i]?.role;
    if (role === "user" || role === "tool") {
      currentIndex = i;
      break;
    }
  }
  if (currentIndex < 0) {
    currentIndex = entries.length - 1;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const currentEntry = entries[currentIndex]?.entry;
  if (!currentEntry) {
    return "";
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const historyEntries = entries.slice(0, currentIndex).map((e) => e.entry);
  if (historyEntries.length === 0) {
    return currentEntry.body;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const formatEntry = (entry: HistoryEntry) => `${entry.sender}: ${entry.body}`;
  return buildHistoryContextFromEntries({
    entries: [...historyEntries, currentEntry],
    currentMessage: formatEntry(currentEntry),
    formatEntry,
  });
}
