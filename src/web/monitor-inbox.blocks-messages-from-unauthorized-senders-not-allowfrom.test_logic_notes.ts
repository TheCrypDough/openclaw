/*
 * AUTO ANNOTATION
 * File: src/web/monitor-inbox.blocks-messages-from-unauthorized-senders-not-allowfrom.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import "./monitor-inbox.test-harness.js";
import { describe, expect, it, vi } from "vitest";
import { monitorWebInbox } from "./inbound.js";
import {
  DEFAULT_ACCOUNT_ID,
  getAuthDir,
  getSock,
  installWebMonitorInboxUnitTestHooks,
  mockLoadConfig,
} from "./monitor-inbox.test-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const nowSeconds = (offsetMs = 0) => Math.floor((Date.now() + offsetMs) / 1000);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_MESSAGES_CFG = {
  messagePrefix: undefined,
  responsePrefix: undefined,
} as const;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TIMESTAMP_OFF_MESSAGES_CFG = {
  ...DEFAULT_MESSAGES_CFG,
  timestampPrefix: false,
} as const;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function flushInboundQueue() {
  await new Promise((resolve) => setImmediate(resolve));
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const createNotifyUpsert = (message: Record<string, unknown>) => ({
  type: "notify",
  messages: [message],
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const createDmMessage = (params: { id: string; remoteJid: string; conversation: string }) => ({
  key: {
    id: params.id,
    fromMe: false,
    remoteJid: params.remoteJid,
  },
  message: { conversation: params.conversation },
  messageTimestamp: nowSeconds(),
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const createGroupMessage = (params: {
  id: string;
  remoteJid?: string;
  participant: string;
  conversation: string;
}) => ({
  key: {
    id: params.id,
    fromMe: false,
    remoteJid: params.remoteJid ?? "11111@g.us",
    participant: params.participant,
  },
  message: { conversation: params.conversation },
  messageTimestamp: nowSeconds(),
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function startWebInboxMonitor(params: {
  config?: Record<string, unknown>;
  sendReadReceipts?: boolean;
}) {
  if (params.config) {
    mockLoadConfig.mockReturnValue(params.config);
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const onMessage = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = {
    verbose: false,
    accountId: DEFAULT_ACCOUNT_ID,
    authDir: getAuthDir(),
    onMessage,
  };
  const listener = await monitorWebInbox(
    params.sendReadReceipts === undefined
      ? base
      : {
          ...base,
          sendReadReceipts: params.sendReadReceipts,
        },
  );
  return { onMessage, listener, sock: getSock() };
}

describe("web monitor inbox", () => {
  installWebMonitorInboxUnitTestHooks();

  it("blocks messages from unauthorized senders not in allowFrom", async () => {
    // Test for auto-recovery fix: early allowFrom filtering prevents Bad MAC errors
    // from unauthorized senders corrupting sessions
    const config = {
      channels: {
        whatsapp: {
          // Only allow +111
          allowFrom: ["+111"],
        },
      },
      messages: DEFAULT_MESSAGES_CFG,
    };

    const { onMessage, listener, sock } = await startWebInboxMonitor({
      config,
    });

    // Message from unauthorized sender +999 (not in allowFrom)
    sock.ev.emit(
      "messages.upsert",
      createNotifyUpsert(
        createDmMessage({
          id: "unauth1",
          remoteJid: "999@s.whatsapp.net",
          conversation: "unauthorized message",
        }),
      ),
    );
    await flushInboundQueue();

    // Should NOT call onMessage for unauthorized senders
    expect(onMessage).not.toHaveBeenCalled();
    // Should NOT send read receipts for blocked senders (privacy + avoids Baileys Bad MAC churn).
    expect(sock.readMessages).not.toHaveBeenCalled();
    expect(sock.sendMessage).toHaveBeenCalledTimes(1);
    expect(sock.sendMessage).toHaveBeenCalledWith("999@s.whatsapp.net", {
      text: expect.stringContaining("Your WhatsApp phone number: +999"),
    });
    expect(sock.sendMessage).toHaveBeenCalledWith("999@s.whatsapp.net", {
      text: expect.stringContaining("Pairing code: PAIRCODE"),
    });

    await listener.close();
  });

  it("skips read receipts in self-chat mode", async () => {
    const config = {
      channels: {
        whatsapp: {
          // Self-chat heuristic: allowFrom includes selfE164 (+123).
          allowFrom: ["+123"],
        },
      },
      messages: DEFAULT_MESSAGES_CFG,
    };

    const { onMessage, listener, sock } = await startWebInboxMonitor({
      config,
    });

    sock.ev.emit(
      "messages.upsert",
      createNotifyUpsert(
        createDmMessage({
          id: "self1",
          remoteJid: "123@s.whatsapp.net",
          conversation: "self ping",
        }),
      ),
    );
    await flushInboundQueue();

    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining({ from: "+123", to: "+123", body: "self ping" }),
    );
    expect(sock.readMessages).not.toHaveBeenCalled();

    await listener.close();
  });

  it("skips read receipts when disabled", async () => {
    const { onMessage, listener, sock } = await startWebInboxMonitor({
      sendReadReceipts: false,
    });
    sock.ev.emit(
      "messages.upsert",
      createNotifyUpsert(
        createDmMessage({
          id: "rr-off-1",
          remoteJid: "222@s.whatsapp.net",
          conversation: "read receipts off",
        }),
      ),
    );
    await flushInboundQueue();

    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(sock.readMessages).not.toHaveBeenCalled();

    await listener.close();
  });

  it("lets group messages through even when sender not in allowFrom", async () => {
    const { onMessage, listener, sock } = await startWebInboxMonitor({
      config: {
        channels: { whatsapp: { allowFrom: ["+1234"], groupPolicy: "open" } },
        messages: DEFAULT_MESSAGES_CFG,
      },
    });
    sock.ev.emit(
      "messages.upsert",
      createNotifyUpsert(
        createGroupMessage({
          id: "grp3",
          participant: "999@s.whatsapp.net",
          conversation: "unauthorized group message",
        }),
      ),
    );
    await flushInboundQueue();

    expect(onMessage).toHaveBeenCalledTimes(1);
    const payload = onMessage.mock.calls[0][0];
    expect(payload.chatType).toBe("group");
    expect(payload.senderE164).toBe("+999");

    await listener.close();
  });

  it("blocks all group messages when groupPolicy is 'disabled'", async () => {
    const { onMessage, listener, sock } = await startWebInboxMonitor({
      config: {
        channels: { whatsapp: { allowFrom: ["+1234"], groupPolicy: "disabled" } },
        messages: TIMESTAMP_OFF_MESSAGES_CFG,
      },
    });
    sock.ev.emit(
      "messages.upsert",
      createNotifyUpsert(
        createGroupMessage({
          id: "grp-disabled",
          participant: "999@s.whatsapp.net",
          conversation: "group message should be blocked",
        }),
      ),
    );
    await flushInboundQueue();

    // Should NOT call onMessage because groupPolicy is disabled
    expect(onMessage).not.toHaveBeenCalled();

    await listener.close();
  });

  it("blocks group messages from senders not in groupAllowFrom when groupPolicy is 'allowlist'", async () => {
    const { onMessage, listener, sock } = await startWebInboxMonitor({
      config: {
        channels: {
          whatsapp: {
            groupAllowFrom: ["+1234"], // Does not include +999
            groupPolicy: "allowlist",
          },
        },
        messages: TIMESTAMP_OFF_MESSAGES_CFG,
      },
    });
    sock.ev.emit(
      "messages.upsert",
      createNotifyUpsert(
        createGroupMessage({
          id: "grp-allowlist-blocked",
          participant: "999@s.whatsapp.net",
          conversation: "unauthorized group sender",
        }),
      ),
    );
    await flushInboundQueue();

    // Should NOT call onMessage because sender +999 not in groupAllowFrom
    expect(onMessage).not.toHaveBeenCalled();

    await listener.close();
  });

  it("allows group messages from senders in groupAllowFrom when groupPolicy is 'allowlist'", async () => {
    const { onMessage, listener, sock } = await startWebInboxMonitor({
      config: {
        channels: {
          whatsapp: {
            groupAllowFrom: ["+15551234567"], // Includes the sender
            groupPolicy: "allowlist",
          },
        },
        messages: TIMESTAMP_OFF_MESSAGES_CFG,
      },
    });
    sock.ev.emit(
      "messages.upsert",
      createNotifyUpsert(
        createGroupMessage({
          id: "grp-allowlist-allowed",
          participant: "15551234567@s.whatsapp.net",
          conversation: "authorized group sender",
        }),
      ),
    );
    await flushInboundQueue();

    // Should call onMessage because sender is in groupAllowFrom
    expect(onMessage).toHaveBeenCalledTimes(1);
    const payload = onMessage.mock.calls[0][0];
    expect(payload.chatType).toBe("group");
    expect(payload.senderE164).toBe("+15551234567");

    await listener.close();
  });

  it("allows all group senders with wildcard in groupPolicy allowlist", async () => {
    const { onMessage, listener, sock } = await startWebInboxMonitor({
      config: {
        channels: {
          whatsapp: {
            groupAllowFrom: ["*"], // Wildcard allows everyone
            groupPolicy: "allowlist",
          },
        },
        messages: TIMESTAMP_OFF_MESSAGES_CFG,
      },
    });
    sock.ev.emit(
      "messages.upsert",
      createNotifyUpsert(
        createGroupMessage({
          id: "grp-wildcard-test",
          remoteJid: "22222@g.us",
          participant: "9999999999@s.whatsapp.net",
          conversation: "wildcard group sender",
        }),
      ),
    );
    await flushInboundQueue();

    // Should call onMessage because wildcard allows all senders
    expect(onMessage).toHaveBeenCalledTimes(1);
    const payload = onMessage.mock.calls[0][0];
    expect(payload.chatType).toBe("group");

    await listener.close();
  });

  it("blocks group messages when groupPolicy allowlist has no groupAllowFrom", async () => {
    const { onMessage, listener, sock } = await startWebInboxMonitor({
      config: {
        channels: {
          whatsapp: {
            groupPolicy: "allowlist",
          },
        },
        messages: TIMESTAMP_OFF_MESSAGES_CFG,
      },
    });
    sock.ev.emit(
      "messages.upsert",
      createNotifyUpsert(
        createGroupMessage({
          id: "grp-allowlist-empty",
          participant: "999@s.whatsapp.net",
          conversation: "blocked by empty allowlist",
        }),
      ),
    );
    await flushInboundQueue();

    expect(onMessage).not.toHaveBeenCalled();

    await listener.close();
  });
});
