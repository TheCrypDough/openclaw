/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/allow-from.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { isAllowedParsedChatSender } from "./allow-from.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseAllowTarget(
  entry: string,
):
  | { kind: "chat_id"; chatId: number }
  | { kind: "chat_guid"; chatGuid: string }
  | { kind: "chat_identifier"; chatIdentifier: string }
  | { kind: "handle"; handle: string } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = entry.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("chat_id:")) {
    return { kind: "chat_id", chatId: Number.parseInt(trimmed.slice("chat_id:".length), 10) };
  }
  if (lower.startsWith("chat_guid:")) {
    return { kind: "chat_guid", chatGuid: trimmed.slice("chat_guid:".length) };
  }
  if (lower.startsWith("chat_identifier:")) {
    return {
      kind: "chat_identifier",
      chatIdentifier: trimmed.slice("chat_identifier:".length),
    };
  }
  return { kind: "handle", handle: lower };
}

describe("isAllowedParsedChatSender", () => {
  it("denies when allowFrom is empty", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const allowed = isAllowedParsedChatSender({
      allowFrom: [],
      sender: "+15551234567",
      normalizeSender: (sender) => sender,
      parseAllowTarget,
    });

    expect(allowed).toBe(false);
  });

  it("allows wildcard entries", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const allowed = isAllowedParsedChatSender({
      allowFrom: ["*"],
      sender: "user@example.com",
      normalizeSender: (sender) => sender.toLowerCase(),
      parseAllowTarget,
    });

    expect(allowed).toBe(true);
  });

  it("matches normalized handles", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const allowed = isAllowedParsedChatSender({
      allowFrom: ["User@Example.com"],
      sender: "user@example.com",
      normalizeSender: (sender) => sender.toLowerCase(),
      parseAllowTarget,
    });

    expect(allowed).toBe(true);
  });

  it("matches chat IDs when provided", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const allowed = isAllowedParsedChatSender({
      allowFrom: ["chat_id:42"],
      sender: "+15551234567",
      chatId: 42,
      normalizeSender: (sender) => sender,
      parseAllowTarget,
    });

    expect(allowed).toBe(true);
  });
});
