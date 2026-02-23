# AUTOPLACEHOLDER_ANNOTATION: src/agents/models-config.falls-back-default-baseurl-token-exchange-fails.e2e.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_COPILOT_API_BASE_URL } from "../providers/github-copilot-token.js";
import { withEnvAsync } from "../test-utils/env.js";
import {
  installModelsConfigTestHooks,
  mockCopilotTokenExchangeSuccess,
  withUnsetCopilotTokenEnv,
  withModelsTempHome as withTempHome,
} from "./models-config.e2e-harness.js";
import { ensureOpenClawModelsJson } from "./models-config.js";

installModelsConfigTestHooks({ restoreFetch: true });

describe("models-config", () => {
  it("falls back to default baseUrl when token exchange fails", async () => {
    await withTempHome(async () => {
      await withEnvAsync({ COPILOT_GITHUB_TOKEN: "gh-token" }, async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const fetchMock = vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: async () => ({ message: "boom" }),
        });
        globalThis.fetch = fetchMock as unknown as typeof fetch;

        await ensureOpenClawModelsJson({ models: { providers: {} } });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const agentDir = path.join(process.env.HOME ?? "", ".openclaw", "agents", "main", "agent");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const raw = await fs.readFile(path.join(agentDir, "models.json"), "utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const parsed = JSON.parse(raw) as {
          providers: Record<string, { baseUrl?: string }>;
        };

        expect(parsed.providers["github-copilot"]?.baseUrl).toBe(DEFAULT_COPILOT_API_BASE_URL);
      });
    });
  });

  it("uses agentDir override auth profiles for copilot injection", async () => {
    await withTempHome(async (home) => {
      await withUnsetCopilotTokenEnv(async () => {
        mockCopilotTokenExchangeSuccess();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const agentDir = path.join(home, "agent-override");
        await fs.mkdir(agentDir, { recursive: true });
        await fs.writeFile(
          path.join(agentDir, "auth-profiles.json"),
          JSON.stringify(
            {
              version: 1,
              profiles: {
                "github-copilot:github": {
                  type: "token",
                  provider: "github-copilot",
                  token: "gh-profile-token",
                },
              },
            },
            null,
            2,
          ),
        );

        await ensureOpenClawModelsJson({ models: { providers: {} } }, agentDir);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const raw = await fs.readFile(path.join(agentDir, "models.json"), "utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const parsed = JSON.parse(raw) as {
          providers: Record<string, { baseUrl?: string }>;
        };

        expect(parsed.providers["github-copilot"]?.baseUrl).toBe("https://api.copilot.example");
      });
    });
  });
});
