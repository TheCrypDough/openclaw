/*
 * AUTO ANNOTATION
 * File: src/plugins/wired-hooks-subagent.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Test: subagent_spawning, subagent_delivery_target, subagent_spawned & subagent_ended hook wiring
 */
import { describe, expect, it, vi } from "vitest";
import { createHookRunner } from "./hooks.js";
import { createMockPluginRegistry } from "./hooks.test-helpers.js";

describe("subagent hook runner methods", () => {
  it("runSubagentSpawning invokes registered subagent_spawning hooks", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler = vi.fn(async () => ({ status: "ok", threadBindingReady: true as const }));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createMockPluginRegistry([{ hookName: "subagent_spawning", handler }]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runner = createHookRunner(registry);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await runner.runSubagentSpawning(
      {
        childSessionKey: "agent:main:subagent:child",
        agentId: "main",
        label: "research",
        mode: "session",
        requester: {
          channel: "discord",
          accountId: "work",
          to: "channel:123",
          threadId: "456",
        },
        threadRequested: true,
      },
      {
        childSessionKey: "agent:main:subagent:child",
        requesterSessionKey: "agent:main:main",
      },
    );

    expect(handler).toHaveBeenCalledWith(
      {
        childSessionKey: "agent:main:subagent:child",
        agentId: "main",
        label: "research",
        mode: "session",
        requester: {
          channel: "discord",
          accountId: "work",
          to: "channel:123",
          threadId: "456",
        },
        threadRequested: true,
      },
      {
        childSessionKey: "agent:main:subagent:child",
        requesterSessionKey: "agent:main:main",
      },
    );
    expect(result).toMatchObject({ status: "ok", threadBindingReady: true });
  });

  it("runSubagentSpawned invokes registered subagent_spawned hooks", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createMockPluginRegistry([{ hookName: "subagent_spawned", handler }]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runner = createHookRunner(registry);

    await runner.runSubagentSpawned(
      {
        runId: "run-1",
        childSessionKey: "agent:main:subagent:child",
        agentId: "main",
        label: "research",
        mode: "run",
        requester: {
          channel: "discord",
          accountId: "work",
          to: "channel:123",
          threadId: "456",
        },
        threadRequested: true,
      },
      {
        runId: "run-1",
        childSessionKey: "agent:main:subagent:child",
        requesterSessionKey: "agent:main:main",
      },
    );

    expect(handler).toHaveBeenCalledWith(
      {
        runId: "run-1",
        childSessionKey: "agent:main:subagent:child",
        agentId: "main",
        label: "research",
        mode: "run",
        requester: {
          channel: "discord",
          accountId: "work",
          to: "channel:123",
          threadId: "456",
        },
        threadRequested: true,
      },
      {
        runId: "run-1",
        childSessionKey: "agent:main:subagent:child",
        requesterSessionKey: "agent:main:main",
      },
    );
  });

  it("runSubagentDeliveryTarget invokes registered subagent_delivery_target hooks", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler = vi.fn(async () => ({
      origin: {
        channel: "discord" as const,
        accountId: "work",
        to: "channel:777",
        threadId: "777",
      },
    }));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createMockPluginRegistry([{ hookName: "subagent_delivery_target", handler }]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runner = createHookRunner(registry);

    const result = await runner.runSubagentDeliveryTarget(
      {
        childSessionKey: "agent:main:subagent:child",
        requesterSessionKey: "agent:main:main",
        requesterOrigin: {
          channel: "discord",
          accountId: "work",
          to: "channel:123",
          threadId: "456",
        },
        childRunId: "run-1",
        spawnMode: "session",
        expectsCompletionMessage: true,
      },
      {
        runId: "run-1",
        childSessionKey: "agent:main:subagent:child",
        requesterSessionKey: "agent:main:main",
      },
    );

    expect(handler).toHaveBeenCalledWith(
      {
        childSessionKey: "agent:main:subagent:child",
        requesterSessionKey: "agent:main:main",
        requesterOrigin: {
          channel: "discord",
          accountId: "work",
          to: "channel:123",
          threadId: "456",
        },
        childRunId: "run-1",
        spawnMode: "session",
        expectsCompletionMessage: true,
      },
      {
        runId: "run-1",
        childSessionKey: "agent:main:subagent:child",
        requesterSessionKey: "agent:main:main",
      },
    );
    expect(result).toEqual({
      origin: {
        channel: "discord",
        accountId: "work",
        to: "channel:777",
        threadId: "777",
      },
    });
  });

  it("runSubagentEnded invokes registered subagent_ended hooks", async () => {
    const handler = vi.fn();
    const registry = createMockPluginRegistry([{ hookName: "subagent_ended", handler }]);
    const runner = createHookRunner(registry);

    await runner.runSubagentEnded(
      {
        targetSessionKey: "agent:main:subagent:child",
        targetKind: "subagent",
        reason: "subagent-complete",
        sendFarewell: true,
        accountId: "work",
        runId: "run-1",
        outcome: "ok",
      },
      {
        runId: "run-1",
        childSessionKey: "agent:main:subagent:child",
        requesterSessionKey: "agent:main:main",
      },
    );

    expect(handler).toHaveBeenCalledWith(
      {
        targetSessionKey: "agent:main:subagent:child",
        targetKind: "subagent",
        reason: "subagent-complete",
        sendFarewell: true,
        accountId: "work",
        runId: "run-1",
        outcome: "ok",
      },
      {
        runId: "run-1",
        childSessionKey: "agent:main:subagent:child",
        requesterSessionKey: "agent:main:main",
      },
    );
  });

  it("hasHooks returns true for registered subagent hooks", () => {
    const registry = createMockPluginRegistry([
      { hookName: "subagent_spawning", handler: vi.fn() },
      { hookName: "subagent_delivery_target", handler: vi.fn() },
    ]);
    const runner = createHookRunner(registry);

    expect(runner.hasHooks("subagent_spawning")).toBe(true);
    expect(runner.hasHooks("subagent_delivery_target")).toBe(true);
    expect(runner.hasHooks("subagent_spawned")).toBe(false);
    expect(runner.hasHooks("subagent_ended")).toBe(false);
  });
});
