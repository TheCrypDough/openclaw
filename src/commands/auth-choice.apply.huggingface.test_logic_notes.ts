/*
 * AUTO ANNOTATION
 * File: src/commands/auth-choice.apply.huggingface.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import type { WizardPrompter } from "../wizard/prompts.js";
import { applyAuthChoiceHuggingface } from "./auth-choice.apply.huggingface.js";
import {
  createAuthTestLifecycle,
  createExitThrowingRuntime,
  createWizardPrompter,
  readAuthProfilesForAgent,
  setupAuthTestEnv,
} from "./test-wizard-helpers.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createHuggingfacePrompter(params: {
  text: WizardPrompter["text"];
  select: WizardPrompter["select"];
  confirm?: WizardPrompter["confirm"];
}): WizardPrompter {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const overrides: Partial<WizardPrompter> = {
    text: params.text,
    select: params.select,
  };
  if (params.confirm) {
    overrides.confirm = params.confirm;
  }
  return createWizardPrompter(overrides, { defaultSelect: "" });
}

describe("applyAuthChoiceHuggingface", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lifecycle = createAuthTestLifecycle([
    "OPENCLAW_STATE_DIR",
    "OPENCLAW_AGENT_DIR",
    "PI_CODING_AGENT_DIR",
    "HF_TOKEN",
    "HUGGINGFACE_HUB_TOKEN",
  ]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function setupTempState() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const env = await setupAuthTestEnv("openclaw-hf-");
    lifecycle.setStateDir(env.stateDir);
    return env.agentDir;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function readAuthProfiles(agentDir: string) {
    return await readAuthProfilesForAgent<{
      profiles?: Record<string, { key?: string }>;
    }>(agentDir);
  }

  afterEach(async () => {
    await lifecycle.cleanup();
  });

  it("returns null when authChoice is not huggingface-api-key", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await applyAuthChoiceHuggingface({
      authChoice: "openrouter-api-key",
      config: {},
      prompter: {} as WizardPrompter,
      runtime: createExitThrowingRuntime(),
      setDefaultModel: false,
    });
    expect(result).toBeNull();
  });

  it("prompts for key and model, then writes config and auth profile", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const agentDir = await setupTempState();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const text = vi.fn().mockResolvedValue("hf-test-token");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const select: WizardPrompter["select"] = vi.fn(
      async (params) => params.options?.[0]?.value as never,
    );
    const prompter = createHuggingfacePrompter({ text, select });
    const runtime = createExitThrowingRuntime();

    const result = await applyAuthChoiceHuggingface({
      authChoice: "huggingface-api-key",
      config: {},
      prompter,
      runtime,
      setDefaultModel: true,
    });

    expect(result).not.toBeNull();
    expect(result?.config.auth?.profiles?.["huggingface:default"]).toMatchObject({
      provider: "huggingface",
      mode: "api_key",
    });
    expect(result?.config.agents?.defaults?.model?.primary).toMatch(/^huggingface\/.+/);
    expect(text).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("Hugging Face") }),
    );
    expect(select).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Default Hugging Face model" }),
    );

    const parsed = await readAuthProfiles(agentDir);
    expect(parsed.profiles?.["huggingface:default"]?.key).toBe("hf-test-token");
  });

  it("does not prompt to reuse env token when opts.token already provided", async () => {
    const agentDir = await setupTempState();
    process.env.HF_TOKEN = "hf-env-token";
    delete process.env.HUGGINGFACE_HUB_TOKEN;

    const text = vi.fn().mockResolvedValue("hf-text-token");
    const select: WizardPrompter["select"] = vi.fn(
      async (params) => params.options?.[0]?.value as never,
    );
    const confirm = vi.fn(async () => true);
    const prompter = createHuggingfacePrompter({ text, select, confirm });
    const runtime = createExitThrowingRuntime();

    const result = await applyAuthChoiceHuggingface({
      authChoice: "huggingface-api-key",
      config: {},
      prompter,
      runtime,
      setDefaultModel: true,
      opts: {
        tokenProvider: "huggingface",
        token: "hf-opts-token",
      },
    });

    expect(result).not.toBeNull();
    expect(confirm).not.toHaveBeenCalled();
    expect(text).not.toHaveBeenCalled();

    const parsed = await readAuthProfiles(agentDir);
    expect(parsed.profiles?.["huggingface:default"]?.key).toBe("hf-opts-token");
  });
});
