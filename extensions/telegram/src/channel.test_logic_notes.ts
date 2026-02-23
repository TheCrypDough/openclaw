/*
 * AUTO ANNOTATION
 * File: extensions/telegram/src/channel.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type {
  ChannelAccountSnapshot,
  ChannelGatewayContext,
  OpenClawConfig,
  PluginRuntime,
  ResolvedTelegramAccount,
  RuntimeEnv,
} from "openclaw/plugin-sdk";
import { describe, expect, it, vi } from "vitest";
import { telegramPlugin } from "./channel.js";
import { setTelegramRuntime } from "./runtime.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createCfg(): OpenClawConfig {
  return {
    channels: {
      telegram: {
        enabled: true,
        accounts: {
          alerts: { botToken: "token-shared" },
          work: { botToken: "token-shared" },
          ops: { botToken: "token-ops" },
        },
      },
    },
  } as OpenClawConfig;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createRuntimeEnv(): RuntimeEnv {
  return {
    log: vi.fn(),
    error: vi.fn(),
    exit: vi.fn((code: number): never => {
      throw new Error(`exit ${code}`);
    }),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createStartAccountCtx(params: {
  cfg: OpenClawConfig;
  accountId: string;
  runtime: RuntimeEnv;
}): ChannelGatewayContext<ResolvedTelegramAccount> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = telegramPlugin.config.resolveAccount(
    params.cfg,
    params.accountId,
  ) as ResolvedTelegramAccount;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const snapshot: ChannelAccountSnapshot = {
    accountId: params.accountId,
    configured: true,
    enabled: true,
    running: false,
  };
  return {
    accountId: params.accountId,
    account,
    cfg: params.cfg,
    runtime: params.runtime,
    abortSignal: new AbortController().signal,
    log: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
    getStatus: () => snapshot,
    setStatus: vi.fn(),
  };
}

describe("telegramPlugin duplicate token guard", () => {
  it("marks secondary account as not configured when token is shared", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = createCfg();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const alertsAccount = telegramPlugin.config.resolveAccount(cfg, "alerts");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const workAccount = telegramPlugin.config.resolveAccount(cfg, "work");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const opsAccount = telegramPlugin.config.resolveAccount(cfg, "ops");

    expect(await telegramPlugin.config.isConfigured!(alertsAccount, cfg)).toBe(true);
    expect(await telegramPlugin.config.isConfigured!(workAccount, cfg)).toBe(false);
    expect(await telegramPlugin.config.isConfigured!(opsAccount, cfg)).toBe(true);

    expect(telegramPlugin.config.unconfiguredReason?.(workAccount, cfg)).toContain(
      'account "alerts"',
    );
  });

  it("surfaces duplicate-token reason in status snapshot", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = createCfg();
    const workAccount = telegramPlugin.config.resolveAccount(cfg, "work");
    const snapshot = await telegramPlugin.status!.buildAccountSnapshot!({
      account: workAccount,
      cfg,
      runtime: undefined,
      probe: undefined,
      audit: undefined,
    });

    expect(snapshot.configured).toBe(false);
    expect(snapshot.lastError).toContain('account "alerts"');
  });

  it("blocks startup for duplicate token accounts before polling starts", async () => {
    const monitorTelegramProvider = vi.fn(async () => undefined);
    const probeTelegram = vi.fn(async () => ({ ok: true, bot: { username: "bot" } }));
    const runtime = {
      channel: {
        telegram: {
          monitorTelegramProvider,
          probeTelegram,
        },
      },
      logging: {
        shouldLogVerbose: () => false,
      },
    } as unknown as PluginRuntime;
    setTelegramRuntime(runtime);

    await expect(
      telegramPlugin.gateway!.startAccount!(
        createStartAccountCtx({
          cfg: createCfg(),
          accountId: "work",
          runtime: createRuntimeEnv(),
        }),
      ),
    ).rejects.toThrow("Duplicate Telegram bot token");

    expect(probeTelegram).not.toHaveBeenCalled();
    expect(monitorTelegramProvider).not.toHaveBeenCalled();
  });
});
