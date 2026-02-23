/*
 * AUTO ANNOTATION
 * File: src/gateway/startup-auth.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const mocks = vi.hoisted(() => ({
  writeConfigFile: vi.fn(async (_cfg: OpenClawConfig) => {}),
}));

vi.mock("../config/config.js", async (importOriginal) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const actual = await importOriginal<typeof import("../config/config.js")>();
  return {
    ...actual,
    writeConfigFile: mocks.writeConfigFile,
  };
});

import {
  assertHooksTokenSeparateFromGatewayAuth,
  ensureGatewayStartupAuth,
} from "./startup-auth.js";

describe("ensureGatewayStartupAuth", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function expectEphemeralGeneratedTokenWhenOverridden(cfg: OpenClawConfig) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await ensureGatewayStartupAuth({
      cfg,
      env: {} as NodeJS.ProcessEnv,
      authOverride: { mode: "token" },
      persist: true,
    });

    expect(result.generatedToken).toMatch(/^[0-9a-f]{48}$/);
    expect(result.persistedGeneratedToken).toBe(false);
    expect(result.auth.mode).toBe("token");
    expect(result.auth.token).toBe(result.generatedToken);
    expect(mocks.writeConfigFile).not.toHaveBeenCalled();
  }

  beforeEach(() => {
    vi.restoreAllMocks();
    mocks.writeConfigFile.mockReset();
  });

  it("generates and persists a token when startup auth is missing", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await ensureGatewayStartupAuth({
      cfg: {},
      env: {} as NodeJS.ProcessEnv,
      persist: true,
    });

    expect(result.generatedToken).toMatch(/^[0-9a-f]{48}$/);
    expect(result.persistedGeneratedToken).toBe(true);
    expect(result.auth.mode).toBe("token");
    expect(result.auth.token).toBe(result.generatedToken);
    expect(mocks.writeConfigFile).toHaveBeenCalledTimes(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const persisted = mocks.writeConfigFile.mock.calls[0]?.[0];
    expect(persisted?.gateway?.auth?.mode).toBe("token");
    expect(persisted?.gateway?.auth?.token).toBe(result.generatedToken);
  });

  it("does not generate when token already exists", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      gateway: {
        auth: {
          mode: "token",
          token: "configured-token",
        },
      },
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await ensureGatewayStartupAuth({
      cfg,
      env: {} as NodeJS.ProcessEnv,
      persist: true,
    });

    expect(result.generatedToken).toBeUndefined();
    expect(result.persistedGeneratedToken).toBe(false);
    expect(result.auth.mode).toBe("token");
    expect(result.auth.token).toBe("configured-token");
    expect(mocks.writeConfigFile).not.toHaveBeenCalled();
  });

  it("does not generate in password mode", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: OpenClawConfig = {
      gateway: {
        auth: {
          mode: "password",
        },
      },
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await ensureGatewayStartupAuth({
      cfg,
      env: {} as NodeJS.ProcessEnv,
      persist: true,
    });

    expect(result.generatedToken).toBeUndefined();
    expect(result.persistedGeneratedToken).toBe(false);
    expect(result.auth.mode).toBe("password");
    expect(mocks.writeConfigFile).not.toHaveBeenCalled();
  });

  it("does not generate in trusted-proxy mode", async () => {
    const cfg: OpenClawConfig = {
      gateway: {
        auth: {
          mode: "trusted-proxy",
          trustedProxy: { userHeader: "x-forwarded-user" },
        },
      },
    };
    const result = await ensureGatewayStartupAuth({
      cfg,
      env: {} as NodeJS.ProcessEnv,
      persist: true,
    });

    expect(result.generatedToken).toBeUndefined();
    expect(result.persistedGeneratedToken).toBe(false);
    expect(result.auth.mode).toBe("trusted-proxy");
    expect(mocks.writeConfigFile).not.toHaveBeenCalled();
  });

  it("does not generate in explicit none mode", async () => {
    const cfg: OpenClawConfig = {
      gateway: {
        auth: {
          mode: "none",
        },
      },
    };
    const result = await ensureGatewayStartupAuth({
      cfg,
      env: {} as NodeJS.ProcessEnv,
      persist: true,
    });

    expect(result.generatedToken).toBeUndefined();
    expect(result.persistedGeneratedToken).toBe(false);
    expect(result.auth.mode).toBe("none");
    expect(mocks.writeConfigFile).not.toHaveBeenCalled();
  });

  it("treats undefined token override as no override", async () => {
    const cfg: OpenClawConfig = {
      gateway: {
        auth: {
          mode: "token",
          token: "from-config",
        },
      },
    };
    const result = await ensureGatewayStartupAuth({
      cfg,
      env: {} as NodeJS.ProcessEnv,
      authOverride: { mode: "token", token: undefined },
      persist: true,
    });

    expect(result.generatedToken).toBeUndefined();
    expect(result.persistedGeneratedToken).toBe(false);
    expect(result.auth.mode).toBe("token");
    expect(result.auth.token).toBe("from-config");
    expect(mocks.writeConfigFile).not.toHaveBeenCalled();
  });

  it("keeps generated token ephemeral when runtime override flips explicit non-token mode", async () => {
    await expectEphemeralGeneratedTokenWhenOverridden({
      gateway: {
        auth: {
          mode: "password",
        },
      },
    });
  });

  it("keeps generated token ephemeral when runtime override flips explicit none mode", async () => {
    await expectEphemeralGeneratedTokenWhenOverridden({
      gateway: {
        auth: {
          mode: "none",
        },
      },
    });
  });

  it("keeps generated token ephemeral when runtime override flips implicit password mode", async () => {
    await expectEphemeralGeneratedTokenWhenOverridden({
      gateway: {
        auth: {
          password: "configured-password",
        },
      },
    });
  });

  it("throws when hooks token reuses gateway token resolved from env", async () => {
    await expect(
      ensureGatewayStartupAuth({
        cfg: {
          hooks: {
            enabled: true,
            token: "shared-gateway-token-1234567890",
          },
        },
        env: {
          OPENCLAW_GATEWAY_TOKEN: "shared-gateway-token-1234567890",
        } as NodeJS.ProcessEnv,
      }),
    ).rejects.toThrow(/hooks\.token must not match gateway auth token/i);
  });
});

describe("assertHooksTokenSeparateFromGatewayAuth", () => {
  it("throws when hooks token reuses gateway token auth", () => {
    expect(() =>
      assertHooksTokenSeparateFromGatewayAuth({
        cfg: {
          hooks: {
            enabled: true,
            token: "shared-gateway-token-1234567890",
          },
        },
        auth: {
          mode: "token",
          modeSource: "config",
          token: "shared-gateway-token-1234567890",
          allowTailscale: false,
        },
      }),
    ).toThrow(/hooks\.token must not match gateway auth token/i);
  });

  it("allows hooks token when gateway auth is not token mode", () => {
    expect(() =>
      assertHooksTokenSeparateFromGatewayAuth({
        cfg: {
          hooks: {
            enabled: true,
            token: "shared-gateway-token-1234567890",
          },
        },
        auth: {
          mode: "password",
          modeSource: "config",
          password: "pw",
          allowTailscale: false,
        },
      }),
    ).not.toThrow();
  });

  it("allows matching values when hooks are disabled", () => {
    expect(() =>
      assertHooksTokenSeparateFromGatewayAuth({
        cfg: {
          hooks: {
            enabled: false,
            token: "shared-gateway-token-1234567890",
          },
        },
        auth: {
          mode: "token",
          modeSource: "config",
          token: "shared-gateway-token-1234567890",
          allowTailscale: false,
        },
      }),
    ).not.toThrow();
  });
});
