/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-session-ttl.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const hoisted = vi.hoisted(() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const getThreadBindingManagerMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const setThreadBindingTtlBySessionKeyMock = vi.fn();
  return {
    getThreadBindingManagerMock,
    setThreadBindingTtlBySessionKeyMock,
  };
});

vi.mock("../../discord/monitor/thread-bindings.js", async (importOriginal) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await importOriginal<typeof import("../../discord/monitor/thread-bindings.js")>();
  return {
    ...actual,
    getThreadBindingManager: hoisted.getThreadBindingManagerMock,
    setThreadBindingTtlBySessionKey: hoisted.setThreadBindingTtlBySessionKeyMock,
  };
});

const { handleSessionCommand } = await import("./commands-session.js");
const { buildCommandTestParams } = await import("./commands.test-harness.js");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const baseCfg = {
  session: { mainKey: "main", scope: "per-sender" },
} satisfies OpenClawConfig;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type FakeBinding = {
  threadId: string;
  targetSessionKey: string;
  expiresAt?: number;
  boundBy?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createDiscordCommandParams(commandBody: string, overrides?: Record<string, unknown>) {
  return buildCommandTestParams(commandBody, baseCfg, {
    Provider: "discord",
    Surface: "discord",
    OriginatingChannel: "discord",
    OriginatingTo: "channel:thread-1",
    AccountId: "default",
    MessageThreadId: "thread-1",
    ...overrides,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createFakeThreadBindingManager(binding: FakeBinding | null) {
  return {
    getByThreadId: vi.fn((_threadId: string) => binding),
  };
}

describe("/session ttl", () => {
  beforeEach(() => {
    hoisted.getThreadBindingManagerMock.mockReset();
    hoisted.setThreadBindingTtlBySessionKeyMock.mockReset();
    vi.useRealTimers();
  });

  it("sets ttl for the focused session", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const binding: FakeBinding = {
      threadId: "thread-1",
      targetSessionKey: "agent:main:subagent:child",
    };
    hoisted.getThreadBindingManagerMock.mockReturnValue(createFakeThreadBindingManager(binding));
    hoisted.setThreadBindingTtlBySessionKeyMock.mockReturnValue([
      {
        ...binding,
        boundAt: Date.now(),
        expiresAt: new Date("2026-02-21T02:00:00.000Z").getTime(),
      },
    ]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await handleSessionCommand(createDiscordCommandParams("/session ttl 2h"), true);
    const text = result?.reply?.text ?? "";

    expect(hoisted.setThreadBindingTtlBySessionKeyMock).toHaveBeenCalledWith({
      targetSessionKey: "agent:main:subagent:child",
      accountId: "default",
      ttlMs: 2 * 60 * 60 * 1000,
    });
    expect(text).toContain("Session TTL set to 2h");
    expect(text).toContain("2026-02-21T02:00:00.000Z");
  });

  it("shows active ttl when no value is provided", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-20T00:00:00.000Z"));

    const binding: FakeBinding = {
      threadId: "thread-1",
      targetSessionKey: "agent:main:subagent:child",
      expiresAt: new Date("2026-02-20T02:00:00.000Z").getTime(),
    };
    hoisted.getThreadBindingManagerMock.mockReturnValue(createFakeThreadBindingManager(binding));

    const result = await handleSessionCommand(createDiscordCommandParams("/session ttl"), true);
    expect(result?.reply?.text).toContain("Session TTL active (2h");
  });

  it("disables ttl when set to off", async () => {
    const binding: FakeBinding = {
      threadId: "thread-1",
      targetSessionKey: "agent:main:subagent:child",
      expiresAt: new Date("2026-02-20T02:00:00.000Z").getTime(),
    };
    hoisted.getThreadBindingManagerMock.mockReturnValue(createFakeThreadBindingManager(binding));
    hoisted.setThreadBindingTtlBySessionKeyMock.mockReturnValue([
      { ...binding, boundAt: Date.now(), expiresAt: undefined },
    ]);

    const result = await handleSessionCommand(createDiscordCommandParams("/session ttl off"), true);

    expect(hoisted.setThreadBindingTtlBySessionKeyMock).toHaveBeenCalledWith({
      targetSessionKey: "agent:main:subagent:child",
      accountId: "default",
      ttlMs: 0,
    });
    expect(result?.reply?.text).toContain("Session TTL disabled");
  });

  it("is unavailable outside discord", async () => {
    const params = buildCommandTestParams("/session ttl 2h", baseCfg);
    const result = await handleSessionCommand(params, true);
    expect(result?.reply?.text).toContain("currently available for Discord thread-bound sessions");
  });

  it("requires binding owner for ttl updates", async () => {
    const binding: FakeBinding = {
      threadId: "thread-1",
      targetSessionKey: "agent:main:subagent:child",
      boundBy: "owner-1",
    };
    hoisted.getThreadBindingManagerMock.mockReturnValue(createFakeThreadBindingManager(binding));

    const result = await handleSessionCommand(
      createDiscordCommandParams("/session ttl 2h", {
        SenderId: "other-user",
      }),
      true,
    );

    expect(hoisted.setThreadBindingTtlBySessionKeyMock).not.toHaveBeenCalled();
    expect(result?.reply?.text).toContain("Only owner-1 can update session TTL");
  });
});
