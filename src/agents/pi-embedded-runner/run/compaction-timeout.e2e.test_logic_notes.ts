/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner/run/compaction-timeout.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentMessage } from "@mariozechner/pi-agent-core";
import { describe, expect, it } from "vitest";
import {
  selectCompactionTimeoutSnapshot,
  shouldFlagCompactionTimeout,
} from "./compaction-timeout.js";

describe("compaction-timeout helpers", () => {
  it("flags compaction timeout consistently for internal and external timeout sources", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const internalTimer = shouldFlagCompactionTimeout({
      isTimeout: true,
      isCompactionPendingOrRetrying: true,
      isCompactionInFlight: false,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const externalAbort = shouldFlagCompactionTimeout({
      isTimeout: true,
      isCompactionPendingOrRetrying: true,
      isCompactionInFlight: false,
    });
    expect(internalTimer).toBe(true);
    expect(externalAbort).toBe(true);
  });

  it("does not flag when timeout is false", () => {
    expect(
      shouldFlagCompactionTimeout({
        isTimeout: false,
        isCompactionPendingOrRetrying: true,
        isCompactionInFlight: true,
      }),
    ).toBe(false);
  });

  it("uses pre-compaction snapshot when compaction timeout occurs", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pre = [{ role: "assistant", content: "pre" } as unknown as AgentMessage] as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const current = [{ role: "assistant", content: "current" } as unknown as AgentMessage] as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const selected = selectCompactionTimeoutSnapshot({
      timedOutDuringCompaction: true,
      preCompactionSnapshot: [...pre],
      preCompactionSessionId: "session-pre",
      currentSnapshot: [...current],
      currentSessionId: "session-current",
    });
    expect(selected.source).toBe("pre-compaction");
    expect(selected.sessionIdUsed).toBe("session-pre");
    expect(selected.messagesSnapshot).toEqual(pre);
  });

  it("falls back to current snapshot when pre-compaction snapshot is unavailable", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const current = [{ role: "assistant", content: "current" } as unknown as AgentMessage] as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const selected = selectCompactionTimeoutSnapshot({
      timedOutDuringCompaction: true,
      preCompactionSnapshot: null,
      preCompactionSessionId: "session-pre",
      currentSnapshot: [...current],
      currentSessionId: "session-current",
    });
    expect(selected.source).toBe("current");
    expect(selected.sessionIdUsed).toBe("session-current");
    expect(selected.messagesSnapshot).toEqual(current);
  });
});
