/*
 * AUTO ANNOTATION
 * File: src/acp/session.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createInMemorySessionStore } from "./session.js";

describe("acp session manager", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let nowMs = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = () => nowMs;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const advance = (ms: number) => {
    nowMs += ms;
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let store = createInMemorySessionStore({ now });

  beforeEach(() => {
    nowMs = 1_000;
    store = createInMemorySessionStore({ now });
  });

  afterEach(() => {
    store.clearAllSessionsForTest();
  });

  it("tracks active runs and clears on cancel", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const session = store.createSession({
      sessionKey: "acp:test",
      cwd: "/tmp",
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const controller = new AbortController();
    store.setActiveRun(session.sessionId, "run-1", controller);

    expect(store.getSessionByRunId("run-1")?.sessionId).toBe(session.sessionId);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cancelled = store.cancelActiveRun(session.sessionId);
    expect(cancelled).toBe(true);
    expect(store.getSessionByRunId("run-1")).toBeUndefined();
  });

  it("refreshes existing session IDs instead of creating duplicates", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const first = store.createSession({
      sessionId: "existing",
      sessionKey: "acp:one",
      cwd: "/tmp/one",
    });
    advance(500);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const refreshed = store.createSession({
      sessionId: "existing",
      sessionKey: "acp:two",
      cwd: "/tmp/two",
    });

    expect(refreshed).toBe(first);
    expect(refreshed.sessionKey).toBe("acp:two");
    expect(refreshed.cwd).toBe("/tmp/two");
    expect(refreshed.createdAt).toBe(1_000);
    expect(refreshed.lastTouchedAt).toBe(1_500);
    expect(store.hasSession("existing")).toBe(true);
  });

  it("reaps idle sessions before enforcing the max session cap", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const boundedStore = createInMemorySessionStore({
      maxSessions: 1,
      idleTtlMs: 1_000,
      now,
    });
    try {
      boundedStore.createSession({
        sessionId: "old",
        sessionKey: "acp:old",
        cwd: "/tmp",
      });
      advance(2_000);
      const fresh = boundedStore.createSession({
        sessionId: "fresh",
        sessionKey: "acp:fresh",
        cwd: "/tmp",
      });

      expect(fresh.sessionId).toBe("fresh");
      expect(boundedStore.getSession("old")).toBeUndefined();
      expect(boundedStore.hasSession("old")).toBe(false);
    } finally {
      boundedStore.clearAllSessionsForTest();
    }
  });

  it("uses soft-cap eviction for the oldest idle session when full", () => {
    const boundedStore = createInMemorySessionStore({
      maxSessions: 2,
      idleTtlMs: 24 * 60 * 60 * 1_000,
      now,
    });
    try {
      const first = boundedStore.createSession({
        sessionId: "first",
        sessionKey: "acp:first",
        cwd: "/tmp",
      });
      advance(100);
      const second = boundedStore.createSession({
        sessionId: "second",
        sessionKey: "acp:second",
        cwd: "/tmp",
      });
      const controller = new AbortController();
      boundedStore.setActiveRun(second.sessionId, "run-2", controller);
      advance(100);

      const third = boundedStore.createSession({
        sessionId: "third",
        sessionKey: "acp:third",
        cwd: "/tmp",
      });

      expect(third.sessionId).toBe("third");
      expect(boundedStore.getSession(first.sessionId)).toBeUndefined();
      expect(boundedStore.getSession(second.sessionId)).toBeDefined();
    } finally {
      boundedStore.clearAllSessionsForTest();
    }
  });

  it("rejects when full and no session is evictable", () => {
    const boundedStore = createInMemorySessionStore({
      maxSessions: 1,
      idleTtlMs: 24 * 60 * 60 * 1_000,
      now,
    });
    try {
      const only = boundedStore.createSession({
        sessionId: "only",
        sessionKey: "acp:only",
        cwd: "/tmp",
      });
      boundedStore.setActiveRun(only.sessionId, "run-only", new AbortController());

      expect(() =>
        boundedStore.createSession({
          sessionId: "next",
          sessionKey: "acp:next",
          cwd: "/tmp",
        }),
      ).toThrow(/session limit reached/i);
    } finally {
      boundedStore.clearAllSessionsForTest();
    }
  });
});
