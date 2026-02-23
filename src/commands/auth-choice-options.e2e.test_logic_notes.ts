/*
 * AUTO ANNOTATION
 * File: src/commands/auth-choice-options.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { AuthProfileStore } from "../agents/auth-profiles.js";
import {
  buildAuthChoiceGroups,
  buildAuthChoiceOptions,
  formatAuthChoiceChoicesForCli,
} from "./auth-choice-options.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const EMPTY_STORE: AuthProfileStore = { version: 1, profiles: {} };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function getOptions(includeSkip = false) {
  return buildAuthChoiceOptions({
    store: EMPTY_STORE,
    includeSkip,
  });
}

describe("buildAuthChoiceOptions", () => {
  it("includes GitHub Copilot", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const options = getOptions();

    expect(options.find((opt) => opt.value === "github-copilot")).toBeDefined();
  });

  it("includes setup-token option for Anthropic", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const options = getOptions();

    expect(options.some((opt) => opt.value === "token")).toBe(true);
  });

  it.each([
    ["Z.AI (GLM) auth choice", ["zai-api-key"]],
    ["Xiaomi auth choice", ["xiaomi-api-key"]],
    ["MiniMax auth choice", ["minimax-api", "minimax-api-key-cn", "minimax-api-lightning"]],
    [
      "Moonshot auth choice",
      ["moonshot-api-key", "moonshot-api-key-cn", "kimi-code-api-key", "together-api-key"],
    ],
    ["Vercel AI Gateway auth choice", ["ai-gateway-api-key"]],
    ["Cloudflare AI Gateway auth choice", ["cloudflare-ai-gateway-api-key"]],
    ["Together AI auth choice", ["together-api-key"]],
    ["Synthetic auth choice", ["synthetic-api-key"]],
    ["Chutes OAuth auth choice", ["chutes"]],
    ["Qwen auth choice", ["qwen-portal"]],
    ["xAI auth choice", ["xai-api-key"]],
    ["Volcano Engine auth choice", ["volcengine-api-key"]],
    ["BytePlus auth choice", ["byteplus-api-key"]],
    ["vLLM auth choice", ["vllm"]],
  ])("includes %s", (_label, expectedValues) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const options = getOptions();

    for (const value of expectedValues) {
      expect(options.some((opt) => opt.value === value)).toBe(true);
    }
  });

  it("builds cli help choices from the same catalog", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const options = getOptions(true);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cliChoices = formatAuthChoiceChoicesForCli({
      includeLegacyAliases: false,
      includeSkip: true,
    }).split("|");

    for (const option of options) {
      expect(cliChoices).toContain(option.value);
    }
  });

  it("can include legacy aliases in cli help choices", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cliChoices = formatAuthChoiceChoicesForCli({
      includeLegacyAliases: true,
      includeSkip: true,
    }).split("|");

    expect(cliChoices).toContain("setup-token");
    expect(cliChoices).toContain("oauth");
    expect(cliChoices).toContain("claude-cli");
    expect(cliChoices).toContain("codex-cli");
  });

  it("shows Chutes in grouped provider selection", () => {
    const { groups } = buildAuthChoiceGroups({
      store: EMPTY_STORE,
      includeSkip: false,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const chutesGroup = groups.find((group) => group.value === "chutes");

    expect(chutesGroup).toBeDefined();
    expect(chutesGroup?.options.some((opt) => opt.value === "chutes")).toBe(true);
  });
});
