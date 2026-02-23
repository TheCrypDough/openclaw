/*
 * AUTO ANNOTATION
 * File: extensions/line/src/channel.logout.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type {
  OpenClawConfig,
  PluginRuntime,
  ResolvedLineAccount,
  RuntimeEnv,
} from "openclaw/plugin-sdk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { linePlugin } from "./channel.js";
import { setLineRuntime } from "./runtime.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_ACCOUNT_ID = "default";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type LineRuntimeMocks = {
  writeConfigFile: ReturnType<typeof vi.fn>;
  resolveLineAccount: ReturnType<typeof vi.fn>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createRuntime(): { runtime: PluginRuntime; mocks: LineRuntimeMocks } {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const writeConfigFile = vi.fn(async () => {});
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolveLineAccount = vi.fn(
    ({ cfg, accountId }: { cfg: OpenClawConfig; accountId?: string }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const lineConfig = (cfg.channels?.line ?? {}) as {
        tokenFile?: string;
        secretFile?: string;
        channelAccessToken?: string;
        channelSecret?: string;
        accounts?: Record<string, Record<string, unknown>>;
      };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const entry =
        accountId && accountId !== DEFAULT_ACCOUNT_ID
          ? (lineConfig.accounts?.[accountId] ?? {})
          : lineConfig;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const hasToken =
        // oxlint-disable-next-line typescript/no-explicit-any
        Boolean((entry as any).channelAccessToken) || Boolean((entry as any).tokenFile);
      // oxlint-disable-next-line typescript/no-explicit-any
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const hasSecret = Boolean((entry as any).channelSecret) || Boolean((entry as any).secretFile);
      return { tokenSource: hasToken && hasSecret ? "config" : "none" };
    },
  );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runtime = {
    config: { writeConfigFile },
    channel: { line: { resolveLineAccount } },
  } as unknown as PluginRuntime;

  return { runtime, mocks: { writeConfigFile, resolveLineAccount } };
}

describe("linePlugin gateway.logoutAccount", () => {
  beforeEach(() => {
    setLineRuntime(createRuntime().runtime);
  });

  it("clears tokenFile/secretFile on default account logout", async () => {
    const { runtime, mocks } = createRuntime();
    setLineRuntime(runtime);

    const cfg: OpenClawConfig = {
      channels: {
        line: {
          tokenFile: "/tmp/token",
          secretFile: "/tmp/secret",
        },
      },
    };
    const runtimeEnv: RuntimeEnv = {
      log: vi.fn(),
      error: vi.fn(),
      exit: vi.fn((code: number): never => {
        throw new Error(`exit ${code}`);
      }),
    };
    const resolveAccount = mocks.resolveLineAccount as unknown as (params: {
      cfg: OpenClawConfig;
      accountId?: string;
    }) => ResolvedLineAccount;
    const account = resolveAccount({
      cfg,
      accountId: DEFAULT_ACCOUNT_ID,
    });

    const result = await linePlugin.gateway!.logoutAccount!({
      accountId: DEFAULT_ACCOUNT_ID,
      cfg,
      account,
      runtime: runtimeEnv,
    });

    expect(result.cleared).toBe(true);
    expect(result.loggedOut).toBe(true);
    expect(mocks.writeConfigFile).toHaveBeenCalledWith({});
  });

  it("clears tokenFile/secretFile on account logout", async () => {
    const { runtime, mocks } = createRuntime();
    setLineRuntime(runtime);

    const cfg: OpenClawConfig = {
      channels: {
        line: {
          accounts: {
            primary: {
              tokenFile: "/tmp/token",
              secretFile: "/tmp/secret",
            },
          },
        },
      },
    };
    const runtimeEnv: RuntimeEnv = {
      log: vi.fn(),
      error: vi.fn(),
      exit: vi.fn((code: number): never => {
        throw new Error(`exit ${code}`);
      }),
    };
    const resolveAccount = mocks.resolveLineAccount as unknown as (params: {
      cfg: OpenClawConfig;
      accountId?: string;
    }) => ResolvedLineAccount;
    const account = resolveAccount({
      cfg,
      accountId: "primary",
    });

    const result = await linePlugin.gateway!.logoutAccount!({
      accountId: "primary",
      cfg,
      account,
      runtime: runtimeEnv,
    });

    expect(result.cleared).toBe(true);
    expect(result.loggedOut).toBe(true);
    expect(mocks.writeConfigFile).toHaveBeenCalledWith({});
  });
});
