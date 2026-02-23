/*
 * AUTO ANNOTATION
 * File: src/wizard/onboarding.completion.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { setupOnboardingShellCompletion } from "./onboarding.completion.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createPrompter(confirmValue = false) {
  return {
    confirm: vi.fn(async () => confirmValue),
    note: vi.fn(async () => {}),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createDeps() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const deps: NonNullable<Parameters<typeof setupOnboardingShellCompletion>[0]["deps"]> = {
    resolveCliName: () => "openclaw",
    checkShellCompletionStatus: vi.fn(async (_binName: string) => ({
      shell: "zsh" as const,
      profileInstalled: false,
      cacheExists: false,
      cachePath: "/tmp/openclaw.zsh",
      usesSlowPattern: false,
    })),
    ensureCompletionCacheExists: vi.fn(async (_binName: string) => true),
    installCompletion: vi.fn(async () => {}),
  };
  return deps;
}

describe("setupOnboardingShellCompletion", () => {
  it("QuickStart: installs without prompting", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prompter = createPrompter();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const deps = createDeps();

    await setupOnboardingShellCompletion({ flow: "quickstart", prompter, deps });

    expect(prompter.confirm).not.toHaveBeenCalled();
    expect(deps.ensureCompletionCacheExists).toHaveBeenCalledWith("openclaw");
    expect(deps.installCompletion).toHaveBeenCalledWith("zsh", true, "openclaw");
    expect(prompter.note).toHaveBeenCalled();
  });

  it("Advanced: prompts; skip means no install", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prompter = createPrompter();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const deps = createDeps();

    await setupOnboardingShellCompletion({ flow: "advanced", prompter, deps });

    expect(prompter.confirm).toHaveBeenCalledTimes(1);
    expect(deps.ensureCompletionCacheExists).not.toHaveBeenCalled();
    expect(deps.installCompletion).not.toHaveBeenCalled();
    expect(prompter.note).not.toHaveBeenCalled();
  });
});
