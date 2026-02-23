/*
 * AUTO ANNOTATION
 * File: src/commands/auth-choice.moonshot.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import type { WizardPrompter } from "../wizard/prompts.js";
import { applyAuthChoice } from "./auth-choice.js";
import {
  createAuthTestLifecycle,
  createExitThrowingRuntime,
  createWizardPrompter,
  readAuthProfilesForAgent,
  requireOpenClawAgentDir,
  setupAuthTestEnv,
} from "./test-wizard-helpers.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createPrompter(overrides: Partial<WizardPrompter>): WizardPrompter {
  return createWizardPrompter(overrides, { defaultSelect: "" });
}

describe("applyAuthChoice (moonshot)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lifecycle = createAuthTestLifecycle([
    "OPENCLAW_STATE_DIR",
    "OPENCLAW_AGENT_DIR",
    "PI_CODING_AGENT_DIR",
    "MOONSHOT_API_KEY",
  ]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function setupTempState() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const env = await setupAuthTestEnv("openclaw-auth-");
    lifecycle.setStateDir(env.stateDir);
    delete process.env.MOONSHOT_API_KEY;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function readAuthProfiles() {
    return await readAuthProfilesForAgent<{
      profiles?: Record<string, { key?: string }>;
    }>(requireOpenClawAgentDir());
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function runMoonshotCnFlow(params: {
    config: Record<string, unknown>;
    setDefaultModel: boolean;
  }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = vi.fn().mockResolvedValue("sk-moonshot-cn-test");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prompter = createPrompter({ text: text as unknown as WizardPrompter["text"] });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runtime = createExitThrowingRuntime();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await applyAuthChoice({
      authChoice: "moonshot-api-key-cn",
      config: params.config,
      prompter,
      runtime,
      setDefaultModel: params.setDefaultModel,
    });
    return { result, text };
  }

  afterEach(async () => {
    await lifecycle.cleanup();
  });

  it("keeps the .cn baseUrl when setDefaultModel is false", async () => {
    await setupTempState();

    const { result, text } = await runMoonshotCnFlow({
      config: {
        agents: {
          defaults: {
            model: { primary: "anthropic/claude-opus-4-5" },
          },
        },
      },
      setDefaultModel: false,
    });

    expect(text).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Enter Moonshot API key (.cn)" }),
    );
    expect(result.config.agents?.defaults?.model?.primary).toBe("anthropic/claude-opus-4-5");
    expect(result.config.models?.providers?.moonshot?.baseUrl).toBe("https://api.moonshot.cn/v1");
    expect(result.agentModelOverride).toBe("moonshot/kimi-k2.5");

    const parsed = await readAuthProfiles();
    expect(parsed.profiles?.["moonshot:default"]?.key).toBe("sk-moonshot-cn-test");
  });

  it("sets the default model when setDefaultModel is true", async () => {
    await setupTempState();

    const { result } = await runMoonshotCnFlow({
      config: {},
      setDefaultModel: true,
    });

    expect(result.config.agents?.defaults?.model?.primary).toBe("moonshot/kimi-k2.5");
    expect(result.config.models?.providers?.moonshot?.baseUrl).toBe("https://api.moonshot.cn/v1");
    expect(result.agentModelOverride).toBeUndefined();

    const parsed = await readAuthProfiles();
    expect(parsed.profiles?.["moonshot:default"]?.key).toBe("sk-moonshot-cn-test");
  });
});
