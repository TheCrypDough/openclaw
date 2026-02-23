/*
 * AUTO ANNOTATION
 * File: src/infra/heartbeat-runner.transcript-prune.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { telegramPlugin } from "../../extensions/telegram/src/channel.js";
import { setTelegramRuntime } from "../../extensions/telegram/src/runtime.js";
import type { OpenClawConfig } from "../config/config.js";
import { resolveMainSessionKey } from "../config/sessions.js";
import { setActivePluginRegistry } from "../plugins/runtime.js";
import { createPluginRuntime } from "../plugins/runtime/index.js";
import { createTestRegistry } from "../test-utils/channel-plugins.js";
import { runHeartbeatOnce } from "./heartbeat-runner.js";
import { seedSessionStore, withTempHeartbeatSandbox } from "./heartbeat-runner.test-utils.js";

// Avoid pulling optional runtime deps during isolated runs.
vi.mock("jiti", () => ({ createJiti: () => () => ({}) }));

beforeEach(() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runtime = createPluginRuntime();
  setTelegramRuntime(runtime);
  setActivePluginRegistry(
    createTestRegistry([{ pluginId: "telegram", plugin: telegramPlugin, source: "test" }]),
  );
});

describe("heartbeat transcript pruning", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function createTranscriptWithContent(transcriptPath: string, sessionId: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const header = {
      type: "session",
      version: 3,
      id: sessionId,
      timestamp: new Date().toISOString(),
      cwd: process.cwd(),
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const existingContent = `${JSON.stringify(header)}\n{"role":"user","content":"Hello"}\n{"role":"assistant","content":"Hi there"}\n`;
    await fs.mkdir(path.dirname(transcriptPath), { recursive: true });
    await fs.writeFile(transcriptPath, existingContent);
    return existingContent;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function withTempTelegramHeartbeatSandbox<T>(
    fn: (ctx: {
      tmpDir: string;
      storePath: string;
      replySpy: ReturnType<typeof vi.spyOn>;
    }) => Promise<T>,
  ) {
    return withTempHeartbeatSandbox(fn, {
      prefix: "openclaw-hb-prune-",
      unsetEnvVars: ["TELEGRAM_BOT_TOKEN"],
    });
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function runTranscriptScenario(params: {
    sessionId: string;
    reply: {
      text: string;
      usage: {
        inputTokens: number;
        outputTokens: number;
        cacheReadTokens: number;
        cacheWriteTokens: number;
      };
    };
    expectPruned: boolean;
  }) {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const sessionKey = resolveMainSessionKey(undefined);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const transcriptPath = path.join(tmpDir, `${params.sessionId}.jsonl`);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const originalContent = await createTranscriptWithContent(transcriptPath, params.sessionId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const originalSize = (await fs.stat(transcriptPath)).size;

      await seedSessionStore(storePath, sessionKey, {
        sessionId: params.sessionId,
        lastChannel: "telegram",
        lastProvider: "telegram",
        lastTo: "user123",
      });

      replySpy.mockResolvedValueOnce(params.reply);

      const cfg = {
        version: 1,
        model: "test-model",
        agent: { workspace: tmpDir },
        sessionStore: storePath,
        channels: { telegram: {} },
      } as unknown as OpenClawConfig;

      await runHeartbeatOnce({
        agentId: undefined,
        reason: "test",
        cfg,
        deps: { sendTelegram: vi.fn() },
      });

      const finalSize = (await fs.stat(transcriptPath)).size;
      if (params.expectPruned) {
        const finalContent = await fs.readFile(transcriptPath, "utf-8");
        expect(finalContent).toBe(originalContent);
        expect(finalSize).toBe(originalSize);
        return;
      }
      expect(finalSize).toBeGreaterThanOrEqual(originalSize);
    });
  }

  it("prunes transcript when heartbeat returns HEARTBEAT_OK", async () => {
    await runTranscriptScenario({
      sessionId: "test-session-prune",
      reply: {
        text: "HEARTBEAT_OK",
        usage: { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
      },
      expectPruned: true,
    });
  });

  it("does not prune transcript when heartbeat returns meaningful content", async () => {
    await runTranscriptScenario({
      sessionId: "test-session-no-prune",
      reply: {
        text: "Alert: Something needs your attention!",
        usage: { inputTokens: 10, outputTokens: 20, cacheReadTokens: 0, cacheWriteTokens: 0 },
      },
      expectPruned: false,
    });
  });
});
