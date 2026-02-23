/*
 * AUTO ANNOTATION
 * File: src/browser/control-auth.auto-token.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const mocks = vi.hoisted(() => ({
  loadConfig: vi.fn<() => OpenClawConfig>(),
  writeConfigFile: vi.fn(async (_cfg: OpenClawConfig) => {}),
}));

vi.mock("../config/config.js", async (importOriginal) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await importOriginal<typeof import("../config/config.js")>();
  return {
    ...actual,
    loadConfig: mocks.loadConfig,
    writeConfigFile: mocks.writeConfigFile,
  };
});

import { ensureBrowserControlAuth } from "./control-auth.js";

describe("ensureBrowserControlAuth", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const expectExplicitModeSkipsAutoAuth = async (mode: "password" | "none") => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      gateway: {
        auth: { mode },
      },
      browser: {
        enabled: true,
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await ensureBrowserControlAuth({ cfg, env: {} as NodeJS.ProcessEnv });
    expect(result).toEqual({ auth: {} });
    expect(mocks.loadConfig).not.toHaveBeenCalled();
    expect(mocks.writeConfigFile).not.toHaveBeenCalled();
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    mocks.loadConfig.mockReset();
    mocks.writeConfigFile.mockReset();
  });

  it("returns existing auth and skips writes", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      gateway: {
        auth: {
          token: "already-set",
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await ensureBrowserControlAuth({ cfg, env: {} as NodeJS.ProcessEnv });

    expect(result).toEqual({ auth: { token: "already-set" } });
    expect(mocks.loadConfig).not.toHaveBeenCalled();
    expect(mocks.writeConfigFile).not.toHaveBeenCalled();
  });

  it("auto-generates and persists a token when auth is missing", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      browser: {
        enabled: true,
      },
    };
    mocks.loadConfig.mockReturnValue({
      browser: {
        enabled: true,
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await ensureBrowserControlAuth({ cfg, env: {} as NodeJS.ProcessEnv });

    expect(result.generatedToken).toMatch(/^[0-9a-f]{48}$/);
    expect(result.auth.token).toBe(result.generatedToken);
    expect(mocks.writeConfigFile).toHaveBeenCalledTimes(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const persisted = mocks.writeConfigFile.mock.calls[0]?.[0];
    expect(persisted?.gateway?.auth?.mode).toBe("token");
    expect(persisted?.gateway?.auth?.token).toBe(result.generatedToken);
  });

  it("skips auto-generation in test env", async () => {
    const cfg: OpenClawConfig = {
      browser: {
        enabled: true,
      },
    };

    const result = await ensureBrowserControlAuth({
      cfg,
      env: { NODE_ENV: "test" } as NodeJS.ProcessEnv,
    });

    expect(result).toEqual({ auth: {} });
    expect(mocks.loadConfig).not.toHaveBeenCalled();
    expect(mocks.writeConfigFile).not.toHaveBeenCalled();
  });

  it("respects explicit password mode", async () => {
    await expectExplicitModeSkipsAutoAuth("password");
  });

  it("respects explicit none mode", async () => {
    await expectExplicitModeSkipsAutoAuth("none");
  });

  it("reuses auth from latest config snapshot", async () => {
    const cfg: OpenClawConfig = {
      browser: {
        enabled: true,
      },
    };
    mocks.loadConfig.mockReturnValue({
      gateway: {
        auth: {
          token: "latest-token",
        },
      },
      browser: {
        enabled: true,
      },
    });

    const result = await ensureBrowserControlAuth({ cfg, env: {} as NodeJS.ProcessEnv });

    expect(result).toEqual({ auth: { token: "latest-token" } });
    expect(mocks.writeConfigFile).not.toHaveBeenCalled();
  });
});
