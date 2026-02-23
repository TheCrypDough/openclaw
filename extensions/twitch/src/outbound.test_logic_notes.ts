/*
 * AUTO ANNOTATION
 * File: extensions/twitch/src/outbound.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Tests for outbound.ts module
 *
 * Tests cover:
 * - resolveTarget with various modes (explicit, implicit, heartbeat)
 * - sendText with markdown stripping
 * - sendMedia delegation to sendText
 * - Error handling for missing accounts/channels
 * - Abort signal handling
 */

import { describe, expect, it, vi } from "vitest";
import { twitchOutbound } from "./outbound.js";
import {
  BASE_TWITCH_TEST_ACCOUNT,
  installTwitchTestHooks,
  makeTwitchTestConfig,
} from "./test-fixtures.js";

// Mock dependencies
vi.mock("./config.js", () => ({
  DEFAULT_ACCOUNT_ID: "default",
  getAccountConfig: vi.fn(),
}));

vi.mock("./send.js", () => ({
  sendMessageTwitchInternal: vi.fn(),
}));

vi.mock("./utils/markdown.js", () => ({
  chunkTextForTwitch: vi.fn((text) => text.split(/(.{500})/).filter(Boolean)),
}));

vi.mock("./utils/twitch.js", () => ({
  normalizeTwitchChannel: (channel: string) => channel.toLowerCase().replace(/^#/, ""),
  missingTargetError: (channel: string, hint: string) =>
    new Error(`Missing target for ${channel}. Provide ${hint}`),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function assertResolvedTarget(
  result: ReturnType<NonNullable<typeof twitchOutbound.resolveTarget>>,
): string {
  if (!result.ok) {
    throw result.error;
  }
  return result.to;
}

describe("outbound", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mockAccount = {
    ...BASE_TWITCH_TEST_ACCOUNT,
    accessToken: "oauth:test123",
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolveTarget = twitchOutbound.resolveTarget!;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mockConfig = makeTwitchTestConfig(mockAccount);
  installTwitchTestHooks();

  describe("metadata", () => {
    it("should have direct delivery mode", () => {
      expect(twitchOutbound.deliveryMode).toBe("direct");
    });

    it("should have 500 character text chunk limit", () => {
      expect(twitchOutbound.textChunkLimit).toBe(500);
    });

    it("should have chunker function", () => {
      expect(twitchOutbound.chunker).toBeDefined();
      expect(typeof twitchOutbound.chunker).toBe("function");
    });
  });

  describe("resolveTarget", () => {
    it("should normalize and return target in explicit mode", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = resolveTarget({
        to: "#MyChannel",
        mode: "explicit",
        allowFrom: [],
      });

      expect(result.ok).toBe(true);
      expect(assertResolvedTarget(result)).toBe("mychannel");
    });

    it("should return target in implicit mode with wildcard allowlist", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = resolveTarget({
        to: "#AnyChannel",
        mode: "implicit",
        allowFrom: ["*"],
      });

      expect(result.ok).toBe(true);
      expect(assertResolvedTarget(result)).toBe("anychannel");
    });

    it("should return target in implicit mode when in allowlist", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = resolveTarget({
        to: "#allowed",
        mode: "implicit",
        allowFrom: ["#allowed", "#other"],
      });

      expect(result.ok).toBe(true);
      expect(assertResolvedTarget(result)).toBe("allowed");
    });

    it("should error when target not in allowlist (implicit mode)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = resolveTarget({
        to: "#notallowed",
        mode: "implicit",
        allowFrom: ["#primary", "#secondary"],
      });

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error("expected resolveTarget to fail");
      }
      expect(result.error.message).toContain("Twitch");
    });

    it("should accept any target when allowlist is empty", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = resolveTarget({
        to: "#anychannel",
        mode: "heartbeat",
        allowFrom: [],
      });

      expect(result.ok).toBe(true);
      expect(assertResolvedTarget(result)).toBe("anychannel");
    });

    it("should error when no target provided with allowlist", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = resolveTarget({
        to: undefined,
        mode: "implicit",
        allowFrom: ["#fallback", "#other"],
      });

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error("expected resolveTarget to fail");
      }
      expect(result.error.message).toContain("Twitch");
    });

    it("should return error when no target and no allowlist", () => {
      const result = resolveTarget({
        to: undefined,
        mode: "explicit",
        allowFrom: [],
      });

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error("expected resolveTarget to fail");
      }
      expect(result.error.message).toContain("Missing target");
    });

    it("should handle whitespace-only target", () => {
      const result = resolveTarget({
        to: "   ",
        mode: "explicit",
        allowFrom: [],
      });

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error("expected resolveTarget to fail");
      }
      expect(result.error.message).toContain("Missing target");
    });

    it("should error when target normalizes to empty string", () => {
      const result = resolveTarget({
        to: "#",
        mode: "explicit",
        allowFrom: [],
      });

      expect(result.ok).toBe(false);
      if (result.ok) {
        throw new Error("expected resolveTarget to fail");
      }
      expect(result.error.message).toContain("Twitch");
    });

    it("should filter wildcard from allowlist when checking membership", () => {
      const result = resolveTarget({
        to: "#mychannel",
        mode: "implicit",
        allowFrom: ["*", "#specific"],
      });

      // With wildcard, any target is accepted
      expect(result.ok).toBe(true);
      expect(assertResolvedTarget(result)).toBe("mychannel");
    });
  });

  describe("sendText", () => {
    it("should send message successfully", async () => {
      const { getAccountConfig } = await import("./config.js");
      const { sendMessageTwitchInternal } = await import("./send.js");

      vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
      vi.mocked(sendMessageTwitchInternal).mockResolvedValue({
        ok: true,
        messageId: "twitch-msg-123",
      });

      const result = await twitchOutbound.sendText!({
        cfg: mockConfig,
        to: "#testchannel",
        text: "Hello Twitch!",
        accountId: "default",
      });

      expect(result.channel).toBe("twitch");
      expect(result.messageId).toBe("twitch-msg-123");
      expect(sendMessageTwitchInternal).toHaveBeenCalledWith(
        "testchannel",
        "Hello Twitch!",
        mockConfig,
        "default",
        true,
        console,
      );
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it("should throw when account not found", async () => {
      const { getAccountConfig } = await import("./config.js");

      vi.mocked(getAccountConfig).mockReturnValue(null);

      await expect(
        twitchOutbound.sendText!({
          cfg: mockConfig,
          to: "#testchannel",
          text: "Hello!",
          accountId: "nonexistent",
        }),
      ).rejects.toThrow("Twitch account not found: nonexistent");
    });

    it("should throw when no channel specified", async () => {
      const { getAccountConfig } = await import("./config.js");

      const accountWithoutChannel = { ...mockAccount, channel: undefined as unknown as string };
      vi.mocked(getAccountConfig).mockReturnValue(accountWithoutChannel);

      await expect(
        twitchOutbound.sendText!({
          cfg: mockConfig,
          to: "",
          text: "Hello!",
          accountId: "default",
        }),
      ).rejects.toThrow("No channel specified");
    });

    it("should use account channel when target not provided", async () => {
      const { getAccountConfig } = await import("./config.js");
      const { sendMessageTwitchInternal } = await import("./send.js");

      vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
      vi.mocked(sendMessageTwitchInternal).mockResolvedValue({
        ok: true,
        messageId: "msg-456",
      });

      await twitchOutbound.sendText!({
        cfg: mockConfig,
        to: "",
        text: "Hello!",
        accountId: "default",
      });

      expect(sendMessageTwitchInternal).toHaveBeenCalledWith(
        "testchannel",
        "Hello!",
        mockConfig,
        "default",
        true,
        console,
      );
    });

    it("should handle abort signal", async () => {
      const abortController = new AbortController();
      abortController.abort();

      await expect(
        twitchOutbound.sendText!({
          cfg: mockConfig,
          to: "#testchannel",
          text: "Hello!",
          accountId: "default",
          signal: abortController.signal,
        } as Parameters<NonNullable<typeof twitchOutbound.sendText>>[0]),
      ).rejects.toThrow("Outbound delivery aborted");
    });

    it("should throw on send failure", async () => {
      const { getAccountConfig } = await import("./config.js");
      const { sendMessageTwitchInternal } = await import("./send.js");

      vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
      vi.mocked(sendMessageTwitchInternal).mockResolvedValue({
        ok: false,
        messageId: "failed-msg",
        error: "Connection lost",
      });

      await expect(
        twitchOutbound.sendText!({
          cfg: mockConfig,
          to: "#testchannel",
          text: "Hello!",
          accountId: "default",
        }),
      ).rejects.toThrow("Connection lost");
    });
  });

  describe("sendMedia", () => {
    it("should combine text and media URL", async () => {
      const { sendMessageTwitchInternal } = await import("./send.js");
      const { getAccountConfig } = await import("./config.js");

      vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
      vi.mocked(sendMessageTwitchInternal).mockResolvedValue({
        ok: true,
        messageId: "media-msg-123",
      });

      const result = await twitchOutbound.sendMedia!({
        cfg: mockConfig,
        to: "#testchannel",
        text: "Check this:",
        mediaUrl: "https://example.com/image.png",
        accountId: "default",
      });

      expect(result.channel).toBe("twitch");
      expect(result.messageId).toBe("media-msg-123");
      expect(sendMessageTwitchInternal).toHaveBeenCalledWith(
        expect.anything(),
        "Check this: https://example.com/image.png",
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      );
    });

    it("should send media URL only when no text", async () => {
      const { sendMessageTwitchInternal } = await import("./send.js");
      const { getAccountConfig } = await import("./config.js");

      vi.mocked(getAccountConfig).mockReturnValue(mockAccount);
      vi.mocked(sendMessageTwitchInternal).mockResolvedValue({
        ok: true,
        messageId: "media-only-msg",
      });

      await twitchOutbound.sendMedia!({
        cfg: mockConfig,
        to: "#testchannel",
        text: "",
        mediaUrl: "https://example.com/image.png",
        accountId: "default",
      });

      expect(sendMessageTwitchInternal).toHaveBeenCalledWith(
        expect.anything(),
        "https://example.com/image.png",
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      );
    });

    it("should handle abort signal", async () => {
      const abortController = new AbortController();
      abortController.abort();

      await expect(
        twitchOutbound.sendMedia!({
          cfg: mockConfig,
          to: "#testchannel",
          text: "Check this:",
          mediaUrl: "https://example.com/image.png",
          accountId: "default",
          signal: abortController.signal,
        } as Parameters<NonNullable<typeof twitchOutbound.sendMedia>>[0]),
      ).rejects.toThrow("Outbound delivery aborted");
    });
  });
});
