/*
 * AUTO ANNOTATION
 * File: src/channels/ack-reactions.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import {
  removeAckReactionAfterReply,
  shouldAckReaction,
  shouldAckReactionForWhatsApp,
} from "./ack-reactions.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const flushMicrotasks = async () => {
  await Promise.resolve();
};

describe("shouldAckReaction", () => {
  it("honors direct and group-all scopes", () => {
    expect(
      shouldAckReaction({
        scope: "direct",
        isDirect: true,
        isGroup: false,
        isMentionableGroup: false,
        requireMention: false,
        canDetectMention: false,
        effectiveWasMentioned: false,
      }),
    ).toBe(true);

    expect(
      shouldAckReaction({
        scope: "group-all",
        isDirect: false,
        isGroup: true,
        isMentionableGroup: true,
        requireMention: false,
        canDetectMention: false,
        effectiveWasMentioned: false,
      }),
    ).toBe(true);
  });

  it("skips when scope is off", () => {
    expect(
      shouldAckReaction({
        scope: "off",
        isDirect: true,
        isGroup: true,
        isMentionableGroup: true,
        requireMention: true,
        canDetectMention: true,
        effectiveWasMentioned: true,
      }),
    ).toBe(false);
  });

  it("defaults to group-mentions gating", () => {
    expect(
      shouldAckReaction({
        scope: undefined,
        isDirect: false,
        isGroup: true,
        isMentionableGroup: true,
        requireMention: true,
        canDetectMention: true,
        effectiveWasMentioned: true,
      }),
    ).toBe(true);
  });

  it("requires mention gating for group-mentions", () => {
    expect(
      shouldAckReaction({
        scope: "group-mentions",
        isDirect: false,
        isGroup: true,
        isMentionableGroup: true,
        requireMention: false,
        canDetectMention: true,
        effectiveWasMentioned: true,
      }),
    ).toBe(false);

    expect(
      shouldAckReaction({
        scope: "group-mentions",
        isDirect: false,
        isGroup: true,
        isMentionableGroup: true,
        requireMention: true,
        canDetectMention: false,
        effectiveWasMentioned: true,
      }),
    ).toBe(false);

    expect(
      shouldAckReaction({
        scope: "group-mentions",
        isDirect: false,
        isGroup: true,
        isMentionableGroup: false,
        requireMention: true,
        canDetectMention: true,
        effectiveWasMentioned: true,
      }),
    ).toBe(false);

    expect(
      shouldAckReaction({
        scope: "group-mentions",
        isDirect: false,
        isGroup: true,
        isMentionableGroup: true,
        requireMention: true,
        canDetectMention: true,
        effectiveWasMentioned: true,
      }),
    ).toBe(true);

    expect(
      shouldAckReaction({
        scope: "group-mentions",
        isDirect: false,
        isGroup: true,
        isMentionableGroup: true,
        requireMention: true,
        canDetectMention: true,
        effectiveWasMentioned: false,
        shouldBypassMention: true,
      }),
    ).toBe(true);
  });
});

describe("shouldAckReactionForWhatsApp", () => {
  it("respects direct and group modes", () => {
    expect(
      shouldAckReactionForWhatsApp({
        emoji: "👀",
        isDirect: true,
        isGroup: false,
        directEnabled: false,
        groupMode: "mentions",
        wasMentioned: false,
        groupActivated: false,
      }),
    ).toBe(false);

    expect(
      shouldAckReactionForWhatsApp({
        emoji: "👀",
        isDirect: false,
        isGroup: true,
        directEnabled: true,
        groupMode: "always",
        wasMentioned: false,
        groupActivated: false,
      }),
    ).toBe(true);

    expect(
      shouldAckReactionForWhatsApp({
        emoji: "👀",
        isDirect: false,
        isGroup: true,
        directEnabled: true,
        groupMode: "never",
        wasMentioned: true,
        groupActivated: true,
      }),
    ).toBe(false);
  });

  it("honors mentions or activation for group-mentions", () => {
    expect(
      shouldAckReactionForWhatsApp({
        emoji: "👀",
        isDirect: false,
        isGroup: true,
        directEnabled: true,
        groupMode: "mentions",
        wasMentioned: false,
        groupActivated: true,
      }),
    ).toBe(true);

    expect(
      shouldAckReactionForWhatsApp({
        emoji: "👀",
        isDirect: false,
        isGroup: true,
        directEnabled: true,
        groupMode: "mentions",
        wasMentioned: false,
        groupActivated: false,
      }),
    ).toBe(false);
  });
});

describe("removeAckReactionAfterReply", () => {
  it("removes only when ack succeeded", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const remove = vi.fn().mockResolvedValue(undefined);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onError = vi.fn();
    removeAckReactionAfterReply({
      removeAfterReply: true,
      ackReactionPromise: Promise.resolve(true),
      ackReactionValue: "👀",
      remove,
      onError,
    });
    await flushMicrotasks();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
  });

  it("skips removal when ack did not happen", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const remove = vi.fn().mockResolvedValue(undefined);
    removeAckReactionAfterReply({
      removeAfterReply: true,
      ackReactionPromise: Promise.resolve(false),
      ackReactionValue: "👀",
      remove,
    });
    await flushMicrotasks();
    expect(remove).not.toHaveBeenCalled();
  });
});
