/*
 * AUTO ANNOTATION
 * File: src/plugins/wired-hooks-compaction.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Test: before_compaction & after_compaction hook wiring
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const hookMocks = vi.hoisted(() => ({
  runner: {
    hasHooks: vi.fn(() => false),
    runBeforeCompaction: vi.fn(async () => {}),
    runAfterCompaction: vi.fn(async () => {}),
  },
}));

vi.mock("../plugins/hook-runner-global.js", () => ({
  getGlobalHookRunner: () => hookMocks.runner,
}));

vi.mock("../infra/agent-events.js", () => ({
  emitAgentEvent: vi.fn(),
}));

describe("compaction hook wiring", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let handleAutoCompactionStart: typeof import("../agents/pi-embedded-subscribe.handlers.compaction.js").handleAutoCompactionStart;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let handleAutoCompactionEnd: typeof import("../agents/pi-embedded-subscribe.handlers.compaction.js").handleAutoCompactionEnd;

  beforeAll(async () => {
    ({ handleAutoCompactionStart, handleAutoCompactionEnd } =
      await import("../agents/pi-embedded-subscribe.handlers.compaction.js"));
  });

  beforeEach(() => {
    hookMocks.runner.hasHooks.mockReset();
    hookMocks.runner.hasHooks.mockReturnValue(false);
    hookMocks.runner.runBeforeCompaction.mockReset();
    hookMocks.runner.runBeforeCompaction.mockResolvedValue(undefined);
    hookMocks.runner.runAfterCompaction.mockReset();
    hookMocks.runner.runAfterCompaction.mockResolvedValue(undefined);
  });

  it("calls runBeforeCompaction in handleAutoCompactionStart", () => {
    hookMocks.runner.hasHooks.mockReturnValue(true);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctx = {
      params: { runId: "r1", session: { messages: [1, 2, 3] } },
      state: { compactionInFlight: false },
      log: { debug: vi.fn(), warn: vi.fn() },
      incrementCompactionCount: vi.fn(),
      ensureCompactionPromise: vi.fn(),
    };

    handleAutoCompactionStart(ctx as never);

    expect(hookMocks.runner.runBeforeCompaction).toHaveBeenCalledTimes(1);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const beforeCalls = hookMocks.runner.runBeforeCompaction.mock.calls as unknown as Array<
      [unknown]
    >;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const event = beforeCalls[0]?.[0] as { messageCount?: number } | undefined;
    expect(event?.messageCount).toBe(3);
  });

  it("calls runAfterCompaction when willRetry is false", () => {
    hookMocks.runner.hasHooks.mockReturnValue(true);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctx = {
      params: { runId: "r2", session: { messages: [1, 2] } },
      state: { compactionInFlight: true },
      log: { debug: vi.fn(), warn: vi.fn() },
      maybeResolveCompactionWait: vi.fn(),
      getCompactionCount: () => 1,
    };

    handleAutoCompactionEnd(
      ctx as never,
      {
        type: "auto_compaction_end",
        willRetry: false,
      } as never,
    );

    expect(hookMocks.runner.runAfterCompaction).toHaveBeenCalledTimes(1);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const afterCalls = hookMocks.runner.runAfterCompaction.mock.calls as unknown as Array<
      [unknown]
    >;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const event = afterCalls[0]?.[0] as
      | { messageCount?: number; compactedCount?: number }
      | undefined;
    expect(event?.messageCount).toBe(2);
    expect(event?.compactedCount).toBe(1);
  });

  it("does not call runAfterCompaction when willRetry is true", () => {
    hookMocks.runner.hasHooks.mockReturnValue(true);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctx = {
      params: { runId: "r3", session: { messages: [] } },
      state: { compactionInFlight: true },
      log: { debug: vi.fn(), warn: vi.fn() },
      noteCompactionRetry: vi.fn(),
      resetForCompactionRetry: vi.fn(),
      getCompactionCount: () => 0,
    };

    handleAutoCompactionEnd(
      ctx as never,
      {
        type: "auto_compaction_end",
        willRetry: true,
      } as never,
    );

    expect(hookMocks.runner.runAfterCompaction).not.toHaveBeenCalled();
  });
});
