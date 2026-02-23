/*
 * AUTO ANNOTATION
 * File: src/commands/openai-model-default.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import { applyDefaultModelChoice } from "./auth-choice.default-model.js";
import {
  applyGoogleGeminiModelDefault,
  GOOGLE_GEMINI_DEFAULT_MODEL,
} from "./google-gemini-model-default.js";
import {
  applyOpenAICodexModelDefault,
  OPENAI_CODEX_DEFAULT_MODEL,
} from "./openai-codex-model-default.js";
import {
  applyOpenAIConfig,
  applyOpenAIProviderConfig,
  OPENAI_DEFAULT_MODEL,
} from "./openai-model-default.js";
import {
  applyOpencodeZenModelDefault,
  OPENCODE_ZEN_DEFAULT_MODEL,
} from "./opencode-zen-model-default.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makePrompter(): WizardPrompter {
  return {
    intro: async () => {},
    outro: async () => {},
    note: async () => {},
    select: (async <T>() => "" as T) as WizardPrompter["select"],
    multiselect: (async <T>() => [] as T[]) as WizardPrompter["multiselect"],
    text: async () => "",
    confirm: async () => false,
    progress: () => ({ update: () => {}, stop: () => {} }),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function expectPrimaryModelChanged(
  applied: { changed: boolean; next: OpenClawConfig },
  primary: string,
) {
  expect(applied.changed).toBe(true);
  expect(applied.next.agents?.defaults?.model).toEqual({ primary });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function expectConfigUnchanged(
  applied: { changed: boolean; next: OpenClawConfig },
  cfg: OpenClawConfig,
) {
  expect(applied.changed).toBe(false);
  expect(applied.next).toEqual(cfg);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SharedDefaultModelCase = {
  apply: (cfg: OpenClawConfig) => { changed: boolean; next: OpenClawConfig };
  defaultModel: string;
  overrideConfig: OpenClawConfig;
  alreadyDefaultConfig: OpenClawConfig;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SHARED_DEFAULT_MODEL_CASES: SharedDefaultModelCase[] = [
  {
    apply: applyGoogleGeminiModelDefault,
    defaultModel: GOOGLE_GEMINI_DEFAULT_MODEL,
    overrideConfig: {
      agents: { defaults: { model: { primary: "anthropic/claude-opus-4-5" } } },
    } as OpenClawConfig,
    alreadyDefaultConfig: {
      agents: { defaults: { model: { primary: GOOGLE_GEMINI_DEFAULT_MODEL } } },
    } as OpenClawConfig,
  },
  {
    apply: applyOpencodeZenModelDefault,
    defaultModel: OPENCODE_ZEN_DEFAULT_MODEL,
    overrideConfig: {
      agents: { defaults: { model: "anthropic/claude-opus-4-5" } },
    } as OpenClawConfig,
    alreadyDefaultConfig: {
      agents: { defaults: { model: OPENCODE_ZEN_DEFAULT_MODEL } },
    } as OpenClawConfig,
  },
];

describe("applyDefaultModelChoice", () => {
  it("ensures allowlist entry exists when returning an agent override", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const defaultModel = "vercel-ai-gateway/anthropic/claude-opus-4.6";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const noteAgentModel = vi.fn(async () => {});
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const applied = await applyDefaultModelChoice({
      config: {},
      setDefaultModel: false,
      defaultModel,
      // Simulate a provider function that does not explicitly add the entry.
      applyProviderConfig: (config: OpenClawConfig) => config,
      applyDefaultConfig: (config: OpenClawConfig) => config,
      noteAgentModel,
      prompter: makePrompter(),
    });

    expect(noteAgentModel).toHaveBeenCalledWith(defaultModel);
    expect(applied.agentModelOverride).toBe(defaultModel);
    expect(applied.config.agents?.defaults?.models?.[defaultModel]).toEqual({});
  });

  it("adds canonical allowlist key for anthropic aliases", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const defaultModel = "anthropic/opus-4.6";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const applied = await applyDefaultModelChoice({
      config: {},
      setDefaultModel: false,
      defaultModel,
      applyProviderConfig: (config: OpenClawConfig) => config,
      applyDefaultConfig: (config: OpenClawConfig) => config,
      noteAgentModel: async () => {},
      prompter: makePrompter(),
    });

    expect(applied.config.agents?.defaults?.models?.[defaultModel]).toEqual({});
    expect(applied.config.agents?.defaults?.models?.["anthropic/claude-opus-4-6"]).toEqual({});
  });

  it("uses applyDefaultConfig path when setDefaultModel is true", async () => {
    const defaultModel = "openai/gpt-5.1-codex";
    const applied = await applyDefaultModelChoice({
      config: {},
      setDefaultModel: true,
      defaultModel,
      applyProviderConfig: (config: OpenClawConfig) => config,
      applyDefaultConfig: () => ({
        agents: {
          defaults: {
            model: { primary: defaultModel },
          },
        },
      }),
      noteDefault: defaultModel,
      noteAgentModel: async () => {},
      prompter: makePrompter(),
    });

    expect(applied.agentModelOverride).toBeUndefined();
    expect(applied.config.agents?.defaults?.model).toEqual({ primary: defaultModel });
  });
});

describe("shared default model behavior", () => {
  it("sets defaults when model is unset", () => {
    for (const testCase of SHARED_DEFAULT_MODEL_CASES) {
      const cfg: OpenClawConfig = { agents: { defaults: {} } };
      const applied = testCase.apply(cfg);
      expectPrimaryModelChanged(applied, testCase.defaultModel);
    }
  });

  it("overrides existing models", () => {
    for (const testCase of SHARED_DEFAULT_MODEL_CASES) {
      const applied = testCase.apply(testCase.overrideConfig);
      expectPrimaryModelChanged(applied, testCase.defaultModel);
    }
  });

  it("no-ops when already on the target default", () => {
    for (const testCase of SHARED_DEFAULT_MODEL_CASES) {
      const applied = testCase.apply(testCase.alreadyDefaultConfig);
      expectConfigUnchanged(applied, testCase.alreadyDefaultConfig);
    }
  });
});

describe("applyOpenAIProviderConfig", () => {
  it("adds allowlist entry for default model", () => {
    const next = applyOpenAIProviderConfig({});
    expect(Object.keys(next.agents?.defaults?.models ?? {})).toContain(OPENAI_DEFAULT_MODEL);
  });

  it("preserves existing alias for default model", () => {
    const next = applyOpenAIProviderConfig({
      agents: {
        defaults: {
          models: {
            [OPENAI_DEFAULT_MODEL]: { alias: "My GPT" },
          },
        },
      },
    });
    expect(next.agents?.defaults?.models?.[OPENAI_DEFAULT_MODEL]?.alias).toBe("My GPT");
  });
});

describe("applyOpenAIConfig", () => {
  it("sets default when model is unset", () => {
    const next = applyOpenAIConfig({});
    expect(next.agents?.defaults?.model).toEqual({ primary: OPENAI_DEFAULT_MODEL });
  });

  it("overrides model.primary when model object already exists", () => {
    const next = applyOpenAIConfig({
      agents: { defaults: { model: { primary: "anthropic/claude-opus-4-6", fallbacks: [] } } },
    });
    expect(next.agents?.defaults?.model).toEqual({ primary: OPENAI_DEFAULT_MODEL, fallbacks: [] });
  });
});

describe("applyOpenAICodexModelDefault", () => {
  it("sets openai-codex default when model is unset", () => {
    const cfg: OpenClawConfig = { agents: { defaults: {} } };
    const applied = applyOpenAICodexModelDefault(cfg);
    expectPrimaryModelChanged(applied, OPENAI_CODEX_DEFAULT_MODEL);
  });

  it("sets openai-codex default when model is openai/*", () => {
    const cfg: OpenClawConfig = {
      agents: { defaults: { model: { primary: OPENAI_DEFAULT_MODEL } } },
    };
    const applied = applyOpenAICodexModelDefault(cfg);
    expectPrimaryModelChanged(applied, OPENAI_CODEX_DEFAULT_MODEL);
  });

  it("does not override openai-codex/*", () => {
    const cfg: OpenClawConfig = {
      agents: { defaults: { model: { primary: OPENAI_CODEX_DEFAULT_MODEL } } },
    };
    const applied = applyOpenAICodexModelDefault(cfg);
    expectConfigUnchanged(applied, cfg);
  });

  it("does not override non-openai models", () => {
    const cfg: OpenClawConfig = {
      agents: { defaults: { model: { primary: "anthropic/claude-opus-4-5" } } },
    };
    const applied = applyOpenAICodexModelDefault(cfg);
    expectConfigUnchanged(applied, cfg);
  });
});

describe("applyOpencodeZenModelDefault", () => {
  it("no-ops when already legacy opencode-zen default", () => {
    const cfg = {
      agents: { defaults: { model: "opencode-zen/claude-opus-4-5" } },
    } as OpenClawConfig;
    const applied = applyOpencodeZenModelDefault(cfg);
    expectConfigUnchanged(applied, cfg);
  });

  it("preserves fallbacks when setting primary", () => {
    const cfg: OpenClawConfig = {
      agents: {
        defaults: {
          model: {
            primary: "anthropic/claude-opus-4-5",
            fallbacks: ["google/gemini-3-pro"],
          },
        },
      },
    };
    const applied = applyOpencodeZenModelDefault(cfg);
    expect(applied.changed).toBe(true);
    expect(applied.next.agents?.defaults?.model).toEqual({
      primary: OPENCODE_ZEN_DEFAULT_MODEL,
      fallbacks: ["google/gemini-3-pro"],
    });
  });
});
