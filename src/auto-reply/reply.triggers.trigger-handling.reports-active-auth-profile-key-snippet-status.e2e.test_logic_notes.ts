/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply.triggers.trigger-handling.reports-active-auth-profile-key-snippet-status.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { resolveSessionKey } from "../config/sessions.js";
import {
  createBlockReplyCollector,
  getRunEmbeddedPiAgentMock,
  installTriggerHandlingE2eTestHooks,
  loadGetReplyFromConfig,
  makeCfg,
  mockRunEmbeddedPiAgentOk,
  requireSessionStorePath,
  withTempHome,
} from "./reply.triggers.trigger-handling.test-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let getReplyFromConfig: typeof import("./reply.js").getReplyFromConfig;
beforeAll(async () => {
  getReplyFromConfig = await loadGetReplyFromConfig();
});

installTriggerHandlingE2eTestHooks();

describe("trigger handling", () => {
  it("reports active auth profile and key snippet in status", async () => {
    await withTempHome(async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const runEmbeddedPiAgentMock = getRunEmbeddedPiAgentMock();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const cfg = makeCfg(home);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const agentDir = join(home, ".openclaw", "agents", "main", "agent");
      await fs.mkdir(agentDir, { recursive: true });
      await fs.writeFile(
        join(agentDir, "auth-profiles.json"),
        JSON.stringify(
          {
            version: 1,
            profiles: {
              "anthropic:work": {
                type: "api_key",
                provider: "anthropic",
                key: "sk-test-1234567890abcdef",
              },
            },
            lastGood: { anthropic: "anthropic:work" },
          },
          null,
          2,
        ),
      );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const sessionKey = resolveSessionKey("per-sender", {
        From: "+1002",
        To: "+2000",
        Provider: "whatsapp",
      } as Parameters<typeof resolveSessionKey>[1]);
      await fs.writeFile(
        requireSessionStorePath(cfg),
        JSON.stringify(
          {
            [sessionKey]: {
              sessionId: "session-auth",
              updatedAt: Date.now(),
              authProfileOverride: "anthropic:work",
            },
          },
          null,
          2,
        ),
      );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const res = await getReplyFromConfig(
        {
          Body: "/status",
          From: "+1002",
          To: "+2000",
          Provider: "whatsapp",
          SenderE164: "+1002",
          CommandAuthorized: true,
        },
        {},
        cfg,
      );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = Array.isArray(res) ? res[0]?.text : res?.text;
      expect(text).toContain("api-key");
      expect(text).toMatch(/\u2026|\.{3}/);
      expect(text).toContain("(anthropic:work)");
      expect(text).not.toContain("mixed");
      expect(runEmbeddedPiAgentMock).not.toHaveBeenCalled();
    });
  });

  it("strips inline /status and still runs the agent", async () => {
    await withTempHome(async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const runEmbeddedPiAgentMock = mockRunEmbeddedPiAgentOk();
      const { blockReplies, handlers } = createBlockReplyCollector();
      await getReplyFromConfig(
        {
          Body: "please /status now",
          From: "+1002",
          To: "+2000",
          Provider: "whatsapp",
          Surface: "whatsapp",
          SenderE164: "+1002",
          CommandAuthorized: true,
        },
        handlers,
        makeCfg(home),
      );
      expect(runEmbeddedPiAgentMock).toHaveBeenCalled();
      // Allowlisted senders: inline /status runs immediately (like /help) and is
      // stripped from the prompt; the remaining text continues through the agent.
      expect(blockReplies.length).toBe(1);
      expect(String(blockReplies[0]?.text ?? "").length).toBeGreaterThan(0);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const prompt = runEmbeddedPiAgentMock.mock.calls[0]?.[0]?.prompt ?? "";
      expect(prompt).not.toContain("/status");
    });
  });

  it("handles inline /help and strips it before the agent", async () => {
    await withTempHome(async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const runEmbeddedPiAgentMock = mockRunEmbeddedPiAgentOk();
      const { blockReplies, handlers } = createBlockReplyCollector();
      const res = await getReplyFromConfig(
        {
          Body: "please /help now",
          From: "+1002",
          To: "+2000",
          CommandAuthorized: true,
        },
        handlers,
        makeCfg(home),
      );
      const text = Array.isArray(res) ? res[0]?.text : res?.text;
      expect(blockReplies.length).toBe(1);
      expect(blockReplies[0]?.text).toContain("Help");
      expect(runEmbeddedPiAgentMock).toHaveBeenCalled();
      const prompt = runEmbeddedPiAgentMock.mock.calls[0]?.[0]?.prompt ?? "";
      expect(prompt).not.toContain("/help");
      expect(text).toBe("ok");
    });
  });
});
