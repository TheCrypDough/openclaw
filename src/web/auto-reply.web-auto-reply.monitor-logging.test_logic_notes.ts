/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply.web-auto-reply.monitor-logging.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";
import { setLoggerOverride } from "../logging.js";
import {
  installWebAutoReplyTestHomeHooks,
  installWebAutoReplyUnitTestHooks,
} from "./auto-reply.test-harness.js";
import { monitorWebChannel } from "./auto-reply/monitor.js";

installWebAutoReplyTestHomeHooks();

describe("web auto-reply monitor logging", () => {
  installWebAutoReplyUnitTestHooks();

  it("emits heartbeat logs with connection metadata", async () => {
    vi.useFakeTimers();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const logPath = `/tmp/openclaw-heartbeat-${crypto.randomUUID()}.log`;
    setLoggerOverride({ level: "trace", file: logPath });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runtime = {
      log: vi.fn(),
      error: vi.fn(),
      exit: vi.fn(),
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const controller = new AbortController();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const listenerFactory = vi.fn(async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const onClose = new Promise<void>(() => {
        // never resolves; abort will short-circuit
      });
      return { close: vi.fn(), onClose };
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const run = monitorWebChannel(
      false,
      listenerFactory as never,
      true,
      async () => ({ text: "ok" }),
      runtime as never,
      controller.signal,
      {
        heartbeatSeconds: 1,
        reconnect: { initialMs: 5, maxMs: 5, maxAttempts: 1, factor: 1.1 },
      },
    );

    await vi.advanceTimersByTimeAsync(1_000);
    controller.abort();
    await vi.runAllTimersAsync();
    await run.catch(() => {});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const content = await fs.readFile(logPath, "utf-8");
    expect(content).toMatch(/web-heartbeat/);
    expect(content).toMatch(/connectionId/);
    expect(content).toMatch(/messagesHandled/);
  });

  it("logs outbound replies to file", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const logPath = `/tmp/openclaw-log-test-${crypto.randomUUID()}.log`;
    setLoggerOverride({ level: "trace", file: logPath });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let capturedOnMessage:
      | ((msg: import("./inbound.js").WebInboundMessage) => Promise<void>)
      | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const listenerFactory = async (opts: {
      onMessage: (msg: import("./inbound.js").WebInboundMessage) => Promise<void>;
    }) => {
      capturedOnMessage = opts.onMessage;
      return { close: vi.fn() };
    };

    const resolver = vi.fn().mockResolvedValue({ text: "auto" });
    await monitorWebChannel(false, listenerFactory as never, false, resolver as never);
    expect(capturedOnMessage).toBeDefined();

    await capturedOnMessage?.({
      body: "hello",
      from: "+1",
      conversationId: "+1",
      to: "+2",
      accountId: "default",
      chatType: "direct",
      chatId: "+1",
      id: "msg1",
      sendComposing: vi.fn(),
      reply: vi.fn(),
      sendMedia: vi.fn(),
    });

    const content = await fs.readFile(logPath, "utf-8");
    expect(content).toMatch(/web-auto-reply/);
    expect(content).toMatch(/auto/);
  });
});
