/*
 * AUTO ANNOTATION
 * File: src/line/bot-message-context.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { MessageEvent, PostbackEvent } from "@line/bot-sdk";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { buildLineMessageContext, buildLinePostbackContext } from "./bot-message-context.js";
import type { ResolvedLineAccount } from "./types.js";

describe("buildLineMessageContext", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let tmpDir: string;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let storePath: string;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let cfg: OpenClawConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account: ResolvedLineAccount = {
    accountId: "default",
    enabled: true,
    channelAccessToken: "token",
    channelSecret: "secret",
    tokenSource: "config",
    config: {},
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const createMessageEvent = (
    source: MessageEvent["source"],
    overrides?: Partial<MessageEvent>,
  ): MessageEvent =>
    ({
      type: "message",
      message: { id: "1", type: "text", text: "hello" },
      replyToken: "reply-token",
      timestamp: Date.now(),
      source,
      mode: "active",
      webhookEventId: "evt-1",
      deliveryContext: { isRedelivery: false },
      ...overrides,
    }) as MessageEvent;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const createPostbackEvent = (
    source: PostbackEvent["source"],
    overrides?: Partial<PostbackEvent>,
  ): PostbackEvent =>
    ({
      type: "postback",
      postback: { data: "action=select" },
      replyToken: "reply-token",
      timestamp: Date.now(),
      source,
      mode: "active",
      webhookEventId: "evt-2",
      deliveryContext: { isRedelivery: false },
      ...overrides,
    }) as PostbackEvent;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-line-context-"));
    storePath = path.join(tmpDir, "sessions.json");
    cfg = { session: { store: storePath } };
  });

  afterEach(async () => {
    await fs.rm(tmpDir, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 50,
    });
  });

  it("routes group message replies to the group id", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const event = createMessageEvent({ type: "group", groupId: "group-1", userId: "user-1" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const context = await buildLineMessageContext({
      event,
      allMedia: [],
      cfg,
      account,
    });
    expect(context).not.toBeNull();
    if (!context) {
      throw new Error("context missing");
    }

    expect(context.ctxPayload.OriginatingTo).toBe("line:group:group-1");
    expect(context.ctxPayload.To).toBe("line:group:group-1");
  });

  it("routes group postback replies to the group id", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const event = createPostbackEvent({ type: "group", groupId: "group-2", userId: "user-2" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const context = await buildLinePostbackContext({
      event,
      cfg,
      account,
    });

    expect(context?.ctxPayload.OriginatingTo).toBe("line:group:group-2");
    expect(context?.ctxPayload.To).toBe("line:group:group-2");
  });

  it("routes room postback replies to the room id", async () => {
    const event = createPostbackEvent({ type: "room", roomId: "room-1", userId: "user-3" });

    const context = await buildLinePostbackContext({
      event,
      cfg,
      account,
    });

    expect(context?.ctxPayload.OriginatingTo).toBe("line:room:room-1");
    expect(context?.ctxPayload.To).toBe("line:room:room-1");
  });
});
