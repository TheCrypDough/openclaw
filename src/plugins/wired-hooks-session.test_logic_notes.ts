/*
 * AUTO ANNOTATION
 * File: src/plugins/wired-hooks-session.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Test: session_start & session_end hook wiring
 *
 * Tests the hook runner methods directly since session init is deeply integrated.
 */
import { describe, expect, it, vi } from "vitest";
import { createHookRunner } from "./hooks.js";
import { createMockPluginRegistry } from "./hooks.test-helpers.js";

describe("session hook runner methods", () => {
  it("runSessionStart invokes registered session_start hooks", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createMockPluginRegistry([{ hookName: "session_start", handler }]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runner = createHookRunner(registry);

    await runner.runSessionStart(
      { sessionId: "abc-123", resumedFrom: "old-session" },
      { sessionId: "abc-123", agentId: "main" },
    );

    expect(handler).toHaveBeenCalledWith(
      { sessionId: "abc-123", resumedFrom: "old-session" },
      { sessionId: "abc-123", agentId: "main" },
    );
  });

  it("runSessionEnd invokes registered session_end hooks", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createMockPluginRegistry([{ hookName: "session_end", handler }]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runner = createHookRunner(registry);

    await runner.runSessionEnd(
      { sessionId: "abc-123", messageCount: 42 },
      { sessionId: "abc-123", agentId: "main" },
    );

    expect(handler).toHaveBeenCalledWith(
      { sessionId: "abc-123", messageCount: 42 },
      { sessionId: "abc-123", agentId: "main" },
    );
  });

  it("hasHooks returns true for registered session hooks", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createMockPluginRegistry([{ hookName: "session_start", handler: vi.fn() }]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runner = createHookRunner(registry);

    expect(runner.hasHooks("session_start")).toBe(true);
    expect(runner.hasHooks("session_end")).toBe(false);
  });
});
