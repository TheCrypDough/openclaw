/*
 * AUTO ANNOTATION
 * File: src/infra/heartbeat-runner.model-override.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { telegramPlugin } from "../../extensions/telegram/src/channel.js";
import { setTelegramRuntime } from "../../extensions/telegram/src/runtime.js";
import { whatsappPlugin } from "../../extensions/whatsapp/src/channel.js";
import { setWhatsAppRuntime } from "../../extensions/whatsapp/src/runtime.js";
import * as replyModule from "../auto-reply/reply.js";
import type { OpenClawConfig } from "../config/config.js";
import { resolveAgentMainSessionKey, resolveMainSessionKey } from "../config/sessions.js";
import { setActivePluginRegistry } from "../plugins/runtime.js";
import { createPluginRuntime } from "../plugins/runtime/index.js";
import { createTestRegistry } from "../test-utils/channel-plugins.js";
import { runHeartbeatOnce } from "./heartbeat-runner.js";

// Avoid pulling optional runtime deps during isolated runs.
vi.mock("jiti", () => ({ createJiti: () => () => ({}) }));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SeedSessionInput = {
  lastChannel: string;
  lastTo: string;
  updatedAt?: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function withHeartbeatFixture(
  run: (ctx: {
    tmpDir: string;
    storePath: string;
    seedSession: (sessionKey: string, input: SeedSessionInput) => Promise<void>;
  }) => Promise<unknown>,
): Promise<unknown> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-hb-model-"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storePath = path.join(tmpDir, "sessions.json");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const seedSession = async (sessionKey: string, input: SeedSessionInput) => {
    await fs.writeFile(
      storePath,
      JSON.stringify(
        {
          [sessionKey]: {
            sessionId: "sid",
            updatedAt: input.updatedAt ?? Date.now(),
            lastChannel: input.lastChannel,
            lastTo: input.lastTo,
          },
        },
        null,
        2,
      ),
    );
  };

  await fs.writeFile(path.join(tmpDir, "HEARTBEAT.md"), "- Check status\n", "utf-8");

  try {
    return await run({ tmpDir, storePath, seedSession });
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

beforeEach(() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runtime = createPluginRuntime();
  setTelegramRuntime(runtime);
  setWhatsAppRuntime(runtime);
  setActivePluginRegistry(
    createTestRegistry([
      { pluginId: "whatsapp", plugin: whatsappPlugin, source: "test" },
      { pluginId: "telegram", plugin: telegramPlugin, source: "test" },
    ]),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("runHeartbeatOnce – heartbeat model override", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function runDefaultsHeartbeat(params: {
    model?: string;
    suppressToolErrorWarnings?: boolean;
  }) {
    return withHeartbeatFixture(async ({ tmpDir, storePath, seedSession }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const cfg: OpenClawConfig = {
        agents: {
          defaults: {
            workspace: tmpDir,
            heartbeat: {
              every: "5m",
              target: "whatsapp",
              model: params.model,
              suppressToolErrorWarnings: params.suppressToolErrorWarnings,
            },
          },
        },
        channels: { whatsapp: { allowFrom: ["*"] } },
        session: { store: storePath },
      };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const sessionKey = resolveMainSessionKey(cfg);
      await seedSession(sessionKey, { lastChannel: "whatsapp", lastTo: "+1555" });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const replySpy = vi.spyOn(replyModule, "getReplyFromConfig");
      replySpy.mockResolvedValue({ text: "HEARTBEAT_OK" });

      await runHeartbeatOnce({
        cfg,
        deps: {
          getQueueSize: () => 0,
          nowMs: () => 0,
        },
      });

      expect(replySpy).toHaveBeenCalledTimes(1);
      return replySpy.mock.calls[0]?.[1];
    });
  }

  it("passes heartbeatModelOverride from defaults heartbeat config", async () => {
    const replyOpts = await runDefaultsHeartbeat({ model: "ollama/llama3.2:1b" });
    expect(replyOpts).toEqual(
      expect.objectContaining({
        isHeartbeat: true,
        heartbeatModelOverride: "ollama/llama3.2:1b",
        suppressToolErrorWarnings: false,
      }),
    );
  });

  it("passes suppressToolErrorWarnings when configured", async () => {
    const replyOpts = await runDefaultsHeartbeat({ suppressToolErrorWarnings: true });
    expect(replyOpts).toEqual(
      expect.objectContaining({
        isHeartbeat: true,
        suppressToolErrorWarnings: true,
      }),
    );
  });

  it("passes per-agent heartbeat model override (merged with defaults)", async () => {
    await withHeartbeatFixture(async ({ tmpDir, storePath, seedSession }) => {
      const cfg: OpenClawConfig = {
        agents: {
          defaults: {
            heartbeat: {
              every: "30m",
              model: "openai/gpt-4o-mini",
            },
          },
          list: [
            { id: "main", default: true },
            {
              id: "ops",
              workspace: tmpDir,
              heartbeat: {
                every: "5m",
                target: "whatsapp",
                model: "ollama/llama3.2:1b",
              },
            },
          ],
        },
        channels: { whatsapp: { allowFrom: ["*"] } },
        session: { store: storePath },
      };
      const sessionKey = resolveAgentMainSessionKey({ cfg, agentId: "ops" });
      await seedSession(sessionKey, { lastChannel: "whatsapp", lastTo: "+1555" });

      const replySpy = vi.spyOn(replyModule, "getReplyFromConfig");
      replySpy.mockResolvedValue({ text: "HEARTBEAT_OK" });

      await runHeartbeatOnce({
        cfg,
        agentId: "ops",
        deps: {
          getQueueSize: () => 0,
          nowMs: () => 0,
        },
      });

      expect(replySpy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          isHeartbeat: true,
          heartbeatModelOverride: "ollama/llama3.2:1b",
        }),
        cfg,
      );
    });
  });

  it("does not pass heartbeatModelOverride when no heartbeat model is configured", async () => {
    const replyOpts = await runDefaultsHeartbeat({ model: undefined });
    expect(replyOpts).toEqual(
      expect.objectContaining({
        isHeartbeat: true,
      }),
    );
  });

  it("trims heartbeat model override before passing it downstream", async () => {
    const replyOpts = await runDefaultsHeartbeat({ model: "  ollama/llama3.2:1b  " });
    expect(replyOpts).toEqual(
      expect.objectContaining({
        isHeartbeat: true,
        heartbeatModelOverride: "ollama/llama3.2:1b",
      }),
    );
  });
});
