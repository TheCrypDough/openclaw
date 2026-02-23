/*
 * AUTO ANNOTATION
 * File: src/commands/models/shared.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const mocks = vi.hoisted(() => ({
  readConfigFileSnapshot: vi.fn(),
  writeConfigFile: vi.fn(),
}));

vi.mock("../../config/config.js", () => ({
  readConfigFileSnapshot: (...args: unknown[]) => mocks.readConfigFileSnapshot(...args),
  writeConfigFile: (...args: unknown[]) => mocks.writeConfigFile(...args),
}));

import { loadValidConfigOrThrow, updateConfig } from "./shared.js";

describe("models/shared", () => {
  beforeEach(() => {
    mocks.readConfigFileSnapshot.mockReset();
    mocks.writeConfigFile.mockReset();
  });

  it("returns config when snapshot is valid", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { providers: {} } as unknown as OpenClawConfig;
    mocks.readConfigFileSnapshot.mockResolvedValue({
      valid: true,
      config: cfg,
    });

    await expect(loadValidConfigOrThrow()).resolves.toBe(cfg);
  });

  it("throws formatted issues when snapshot is invalid", async () => {
    mocks.readConfigFileSnapshot.mockResolvedValue({
      valid: false,
      path: "/tmp/openclaw.json",
      issues: [{ path: "providers.openai.apiKey", message: "Required" }],
    });

    await expect(loadValidConfigOrThrow()).rejects.toThrowError(
      "Invalid config at /tmp/openclaw.json\n- providers.openai.apiKey: Required",
    );
  });

  it("updateConfig writes mutated config", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = { update: { channel: "stable" } } as unknown as OpenClawConfig;
    mocks.readConfigFileSnapshot.mockResolvedValue({
      valid: true,
      config: cfg,
    });
    mocks.writeConfigFile.mockResolvedValue(undefined);

    await updateConfig((current) => ({
      ...current,
      update: { channel: "beta" },
    }));

    expect(mocks.writeConfigFile).toHaveBeenCalledWith(
      expect.objectContaining({
        update: { channel: "beta" },
      }),
    );
  });
});
