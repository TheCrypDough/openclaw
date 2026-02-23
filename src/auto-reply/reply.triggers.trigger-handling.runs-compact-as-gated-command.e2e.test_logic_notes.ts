/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply.triggers.trigger-handling.runs-compact-as-gated-command.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { loadSessionStore, resolveSessionKey } from "../config/sessions.js";
import {
  getCompactEmbeddedPiSessionMock,
  getRunEmbeddedPiAgentMock,
  installTriggerHandlingE2eTestHooks,
  makeCfg,
  withTempHome,
} from "./reply.triggers.trigger-handling.test-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let getReplyFromConfig: typeof import("./reply.js").getReplyFromConfig;
beforeAll(async () => {
  ({ getReplyFromConfig } = await import("./reply.js"));
});

installTriggerHandlingE2eTestHooks();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function mockSuccessfulCompaction() {
  getCompactEmbeddedPiSessionMock().mockResolvedValue({
    ok: true,
    compacted: true,
    result: {
      summary: "summary",
      firstKeptEntryId: "x",
      tokensBefore: 12000,
    },
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function replyText(res: Awaited<ReturnType<typeof getReplyFromConfig>>) {
  return Array.isArray(res) ? res[0]?.text : res?.text;
}

describe("trigger handling", () => {
  it("runs /compact as a gated command", async () => {
    await withTempHome(async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const storePath = join(tmpdir(), `openclaw-session-test-${Date.now()}.json`);
      mockSuccessfulCompaction();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await getReplyFromConfig(
        {
          Body: "/compact focus on decisions",
          From: "+1003",
          To: "+2000",
          CommandAuthorized: true,
        },
        {},
        {
          agents: {
            defaults: {
              model: { primary: "anthropic/claude-opus-4-5" },
              workspace: join(home, "openclaw"),
            },
          },
          channels: {
            whatsapp: {
              allowFrom: ["*"],
            },
          },
          session: {
            store: storePath,
          },
        },
      );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = replyText(res);
      expect(text?.startsWith("⚙️ Compacted")).toBe(true);
      expect(getCompactEmbeddedPiSessionMock()).toHaveBeenCalledOnce();
      expect(getRunEmbeddedPiAgentMock()).not.toHaveBeenCalled();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const store = loadSessionStore(storePath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const sessionKey = resolveSessionKey("per-sender", {
        Body: "/compact focus on decisions",
        From: "+1003",
        To: "+2000",
      });
      expect(store[sessionKey]?.compactionCount).toBe(1);
    });
  });
  it("runs /compact for non-default agents without transcript path validation failures", async () => {
    await withTempHome(async (home) => {
      getCompactEmbeddedPiSessionMock().mockClear();
      mockSuccessfulCompaction();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await getReplyFromConfig(
        {
          Body: "/compact",
          From: "+1004",
          To: "+2000",
          SessionKey: "agent:worker1:telegram:12345",
          CommandAuthorized: true,
        },
        {},
        makeCfg(home),
      );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = replyText(res);
      expect(text?.startsWith("⚙️ Compacted")).toBe(true);
      expect(getCompactEmbeddedPiSessionMock()).toHaveBeenCalledOnce();
      expect(getCompactEmbeddedPiSessionMock().mock.calls[0]?.[0]?.sessionFile).toContain(
        join("agents", "worker1", "sessions"),
      );
      expect(getRunEmbeddedPiAgentMock()).not.toHaveBeenCalled();
    });
  });
  it("ignores think directives that only appear in the context wrapper", async () => {
    await withTempHome(async (home) => {
      getRunEmbeddedPiAgentMock().mockResolvedValue({
        payloads: [{ text: "ok" }],
        meta: {
          durationMs: 1,
          agentMeta: { sessionId: "s", provider: "p", model: "m" },
        },
      });

      const res = await getReplyFromConfig(
        {
          Body: [
            "[Chat messages since your last reply - for context]",
            "Peter: /thinking high [2025-12-05T21:45:00.000Z]",
            "",
            "[Current message - respond to this]",
            "Give me the status",
          ].join("\n"),
          From: "+1002",
          To: "+2000",
        },
        {},
        makeCfg(home),
      );

      const text = replyText(res);
      expect(text).toBe("ok");
      expect(getRunEmbeddedPiAgentMock()).toHaveBeenCalledOnce();
      const prompt = getRunEmbeddedPiAgentMock().mock.calls[0]?.[0]?.prompt ?? "";
      expect(prompt).toContain("Give me the status");
      expect(prompt).not.toContain("/thinking high");
      expect(prompt).not.toContain("/think high");
    });
  });
  it("does not emit directive acks for heartbeats with /think", async () => {
    await withTempHome(async (home) => {
      getRunEmbeddedPiAgentMock().mockResolvedValue({
        payloads: [{ text: "ok" }],
        meta: {
          durationMs: 1,
          agentMeta: { sessionId: "s", provider: "p", model: "m" },
        },
      });

      const res = await getReplyFromConfig(
        {
          Body: "HEARTBEAT /think:high",
          From: "+1003",
          To: "+1003",
        },
        { isHeartbeat: true },
        makeCfg(home),
      );

      const text = replyText(res);
      expect(text).toBe("ok");
      expect(text).not.toMatch(/Thinking level set/i);
      expect(getRunEmbeddedPiAgentMock()).toHaveBeenCalledOnce();
    });
  });
});
