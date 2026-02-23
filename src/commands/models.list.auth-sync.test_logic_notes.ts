/*
 * AUTO ANNOTATION
 * File: src/commands/models.list.auth-sync.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { saveAuthProfileStore } from "../agents/auth-profiles.js";
import { clearConfigCache } from "../config/config.js";
import { withEnvAsync } from "../test-utils/env.js";
import { modelsListCommand } from "./models/list.list-command.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function pathExists(pathname: string): Promise<boolean> {
  try {
    await fs.stat(pathname);
    return true;
  } catch {
    return false;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type AuthSyncFixture = {
  root: string;
  stateDir: string;
  agentDir: string;
  configPath: string;
  authPath: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function withAuthSyncFixture(run: (fixture: AuthSyncFixture) => Promise<void>) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-models-list-auth-sync-"));
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stateDir = path.join(root, "state");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentDir = path.join(stateDir, "agents", "main", "agent");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const configPath = path.join(stateDir, "openclaw.json");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const authPath = path.join(agentDir, "auth.json");

    await fs.mkdir(agentDir, { recursive: true });
    await fs.writeFile(configPath, "{}\n", "utf8");

    await withEnvAsync(
      {
        OPENCLAW_STATE_DIR: stateDir,
        OPENCLAW_AGENT_DIR: agentDir,
        PI_CODING_AGENT_DIR: agentDir,
        OPENCLAW_CONFIG_PATH: configPath,
        OPENROUTER_API_KEY: undefined,
      },
      async () => {
        clearConfigCache();
        await run({ root, stateDir, agentDir, configPath, authPath });
      },
    );
  } finally {
    clearConfigCache();
    await fs.rm(root, { recursive: true, force: true });
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createRuntime() {
  return {
    log: vi.fn(),
    error: vi.fn(),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function getProviderRow(payloadText: string, providerPrefix: string) {
  const payload = JSON.parse(payloadText) as {
    models?: Array<{ key?: string; available?: boolean }>;
  };
  return payload.models?.find((model) => String(model.key ?? "").startsWith(providerPrefix));
}

describe("models list auth-profile sync", () => {
  it("marks models available when auth exists only in auth-profiles.json", async () => {
    await withAuthSyncFixture(async ({ agentDir, authPath }) => {
      saveAuthProfileStore(
        {
          version: 1,
          profiles: {
            "openrouter:default": {
              type: "api_key",
              provider: "openrouter",
              key: "sk-or-v1-regression-test",
            },
          },
        },
        agentDir,
      );

      expect(await pathExists(authPath)).toBe(false);

      const runtime = createRuntime();
      await modelsListCommand({ all: true, json: true }, runtime as never);

      expect(runtime.error).not.toHaveBeenCalled();
      expect(runtime.log).toHaveBeenCalledTimes(1);
      const openrouter = getProviderRow(String(runtime.log.mock.calls[0]?.[0]), "openrouter/");
      expect(openrouter).toBeDefined();
      expect(openrouter?.available).toBe(true);
      expect(await pathExists(authPath)).toBe(true);
    });
  });

  it("does not persist blank auth-profile credentials", async () => {
    await withAuthSyncFixture(async ({ agentDir, authPath }) => {
      saveAuthProfileStore(
        {
          version: 1,
          profiles: {
            "openrouter:default": {
              type: "api_key",
              provider: "openrouter",
              key: "   ",
            },
          },
        },
        agentDir,
      );

      const runtime = createRuntime();
      await modelsListCommand({ all: true, json: true }, runtime as never);

      expect(runtime.error).not.toHaveBeenCalled();
      expect(runtime.log).toHaveBeenCalledTimes(1);
      if (await pathExists(authPath)) {
        const parsed = JSON.parse(await fs.readFile(authPath, "utf8")) as Record<
          string,
          { type?: string; key?: string }
        >;
        const openrouterKey = parsed.openrouter?.key;
        if (openrouterKey !== undefined) {
          expect(openrouterKey.trim().length).toBeGreaterThan(0);
        }
      }
    });
  });
});
