/*
 * AUTO ANNOTATION
 * File: src/slack/monitor.threading.missing-thread-ts.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetInboundDedupe } from "../auto-reply/reply/inbound-dedupe.js";
import {
  flush,
  getSlackClient,
  getSlackHandlerOrThrow,
  getSlackTestState,
  resetSlackTestState,
  startSlackMonitor,
  stopSlackMonitor,
} from "./monitor.test-helpers.js";

const { monitorSlackProvider } = await import("./monitor.js");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const slackTestState = getSlackTestState();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SlackConversationsClient = {
  history: ReturnType<typeof vi.fn>;
  info: ReturnType<typeof vi.fn>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeThreadReplyEvent() {
  return {
    event: {
      type: "message",
      user: "U1",
      text: "hello",
      ts: "456",
      parent_user_id: "U2",
      channel: "C1",
      channel_type: "channel",
    },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function getConversationsClient(): SlackConversationsClient {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const client = getSlackClient();
  if (!client) {
    throw new Error("Slack client not registered");
  }
  return client.conversations as SlackConversationsClient;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function runMissingThreadScenario(params: {
  historyResponse?: { messages: Array<{ ts?: string; thread_ts?: string }> };
  historyError?: Error;
}) {
  slackTestState.replyMock.mockResolvedValue({ text: "thread reply" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const conversations = getConversationsClient();
  if (params.historyError) {
    conversations.history.mockRejectedValueOnce(params.historyError);
  } else {
    conversations.history.mockResolvedValueOnce(
      params.historyResponse ?? { messages: [{ ts: "456" }] },
    );
  }

  const { controller, run } = startSlackMonitor(monitorSlackProvider);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const handler = await getSlackHandlerOrThrow("message");
  await handler(makeThreadReplyEvent());

  await flush();
  await stopSlackMonitor({ controller, run });

  expect(slackTestState.sendMock).toHaveBeenCalledTimes(1);
  return slackTestState.sendMock.mock.calls[0]?.[2];
}

beforeEach(() => {
  resetInboundDedupe();
  resetSlackTestState({
    messages: { responsePrefix: "PFX" },
    channels: {
      slack: {
        dm: { enabled: true, policy: "open", allowFrom: ["*"] },
        groupPolicy: "open",
        channels: { C1: { allow: true, requireMention: false } },
      },
    },
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const conversations = getConversationsClient();
  conversations.info.mockResolvedValue({
    channel: { name: "general", is_channel: true },
  });
});

describe("monitorSlackProvider threading", () => {
  it("recovers missing thread_ts when parent_user_id is present", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const options = await runMissingThreadScenario({
      historyResponse: { messages: [{ ts: "456", thread_ts: "111.222" }] },
    });
    expect(options).toMatchObject({ threadTs: "111.222" });
  });

  it("continues without thread_ts when history lookup returns no thread result", async () => {
    const options = await runMissingThreadScenario({
      historyResponse: { messages: [{ ts: "456" }] },
    });
    expect(options).not.toMatchObject({ threadTs: "111.222" });
  });

  it("continues without thread_ts when history lookup throws", async () => {
    const options = await runMissingThreadScenario({
      historyError: new Error("history failed"),
    });
    expect(options).not.toMatchObject({ threadTs: "111.222" });
  });
});
