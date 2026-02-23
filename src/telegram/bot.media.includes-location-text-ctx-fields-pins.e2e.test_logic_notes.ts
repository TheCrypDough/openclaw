/*
 * AUTO ANNOTATION
 * File: src/telegram/bot.media.includes-location-text-ctx-fields-pins.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { onSpy } from "./bot.media.e2e-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function createMessageHandlerAndReplySpy() {
  const { createTelegramBot } = await import("./bot.js");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const replyModule = await import("../auto-reply/reply.js");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const replySpy = (replyModule as unknown as { __replySpy: ReturnType<typeof vi.fn> }).__replySpy;

  onSpy.mockReset();
  replySpy.mockReset();

  createTelegramBot({ token: "tok" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const handler = onSpy.mock.calls.find((call) => call[0] === "message")?.[1] as (
    ctx: Record<string, unknown>,
  ) => Promise<void>;
  expect(handler).toBeDefined();
  return { handler, replySpy };
}

describe("telegram inbound media", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const _INBOUND_MEDIA_TEST_TIMEOUT_MS = process.platform === "win32" ? 30_000 : 20_000;
  it(
    "includes location text and ctx fields for pins",
    async () => {
      const { handler, replySpy } = await createMessageHandlerAndReplySpy();

      await handler({
        message: {
          chat: { id: 42, type: "private" },
          message_id: 5,
          caption: "Meet here",
          date: 1736380800,
          location: {
            latitude: 48.858844,
            longitude: 2.294351,
            horizontal_accuracy: 12,
          },
        },
        me: { username: "openclaw_bot" },
        getFile: async () => ({ file_path: "unused" }),
      });

      expect(replySpy).toHaveBeenCalledTimes(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const payload = replySpy.mock.calls[0][0];
      expect(payload.Body).toContain("Meet here");
      expect(payload.Body).toContain("48.858844");
      expect(payload.LocationLat).toBe(48.858844);
      expect(payload.LocationLon).toBe(2.294351);
      expect(payload.LocationSource).toBe("pin");
      expect(payload.LocationIsLive).toBe(false);
    },
    _INBOUND_MEDIA_TEST_TIMEOUT_MS,
  );

  it(
    "captures venue fields for named places",
    async () => {
      const { handler, replySpy } = await createMessageHandlerAndReplySpy();

      await handler({
        message: {
          chat: { id: 42, type: "private" },
          message_id: 6,
          date: 1736380800,
          venue: {
            title: "Eiffel Tower",
            address: "Champ de Mars, Paris",
            location: { latitude: 48.858844, longitude: 2.294351 },
          },
        },
        me: { username: "openclaw_bot" },
        getFile: async () => ({ file_path: "unused" }),
      });

      expect(replySpy).toHaveBeenCalledTimes(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const payload = replySpy.mock.calls[0][0];
      expect(payload.Body).toContain("Eiffel Tower");
      expect(payload.LocationName).toBe("Eiffel Tower");
      expect(payload.LocationAddress).toBe("Champ de Mars, Paris");
      expect(payload.LocationSource).toBe("place");
    },
    _INBOUND_MEDIA_TEST_TIMEOUT_MS,
  );
});
