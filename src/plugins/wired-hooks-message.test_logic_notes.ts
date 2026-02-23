/*
 * AUTO ANNOTATION
 * File: src/plugins/wired-hooks-message.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Test: message_sending & message_sent hook wiring
 *
 * Tests the hook runner methods directly since outbound delivery is deeply integrated.
 */
import { describe, expect, it, vi } from "vitest";
import { createHookRunner } from "./hooks.js";
import { createMockPluginRegistry } from "./hooks.test-helpers.js";

describe("message_sending hook runner", () => {
  it("runMessageSending invokes registered hooks and returns modified content", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler = vi.fn().mockReturnValue({ content: "modified content" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createMockPluginRegistry([{ hookName: "message_sending", handler }]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runner = createHookRunner(registry);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await runner.runMessageSending(
      { to: "user-123", content: "original content" },
      { channelId: "telegram" },
    );

    expect(handler).toHaveBeenCalledWith(
      { to: "user-123", content: "original content" },
      { channelId: "telegram" },
    );
    expect(result?.content).toBe("modified content");
  });

  it("runMessageSending can cancel message delivery", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler = vi.fn().mockReturnValue({ cancel: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createMockPluginRegistry([{ hookName: "message_sending", handler }]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runner = createHookRunner(registry);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await runner.runMessageSending(
      { to: "user-123", content: "blocked" },
      { channelId: "telegram" },
    );

    expect(result?.cancel).toBe(true);
  });
});

describe("message_sent hook runner", () => {
  it("runMessageSent invokes registered hooks with success=true", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createMockPluginRegistry([{ hookName: "message_sent", handler }]);
    const runner = createHookRunner(registry);

    await runner.runMessageSent(
      { to: "user-123", content: "hello", success: true },
      { channelId: "telegram" },
    );

    expect(handler).toHaveBeenCalledWith(
      { to: "user-123", content: "hello", success: true },
      { channelId: "telegram" },
    );
  });

  it("runMessageSent invokes registered hooks with error on failure", async () => {
    const handler = vi.fn();
    const registry = createMockPluginRegistry([{ hookName: "message_sent", handler }]);
    const runner = createHookRunner(registry);

    await runner.runMessageSent(
      { to: "user-123", content: "hello", success: false, error: "timeout" },
      { channelId: "telegram" },
    );

    expect(handler).toHaveBeenCalledWith(
      { to: "user-123", content: "hello", success: false, error: "timeout" },
      { channelId: "telegram" },
    );
  });
});
