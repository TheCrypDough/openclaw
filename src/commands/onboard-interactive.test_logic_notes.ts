/*
 * AUTO ANNOTATION
 * File: src/commands/onboard-interactive.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import type { RuntimeEnv } from "../runtime.js";
import { WizardCancelledError } from "../wizard/prompts.js";
import { runInteractiveOnboarding } from "./onboard-interactive.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const mocks = vi.hoisted(() => ({
  createClackPrompter: vi.fn(() => ({ id: "prompter" })),
  runOnboardingWizard: vi.fn(async () => {}),
  restoreTerminalState: vi.fn(),
}));

vi.mock("../wizard/clack-prompter.js", () => ({
  createClackPrompter: mocks.createClackPrompter,
}));

vi.mock("../wizard/onboarding.js", () => ({
  runOnboardingWizard: mocks.runOnboardingWizard,
}));

vi.mock("../terminal/restore.js", () => ({
  restoreTerminalState: mocks.restoreTerminalState,
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeRuntime(): RuntimeEnv {
  return {
    log: vi.fn(),
    error: vi.fn(),
    exit: vi.fn() as unknown as RuntimeEnv["exit"],
  };
}

describe("runInteractiveOnboarding", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("restores terminal state without resuming stdin on success", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runtime = makeRuntime();

    await runInteractiveOnboarding({} as never, runtime);

    expect(mocks.runOnboardingWizard).toHaveBeenCalledOnce();
    expect(mocks.restoreTerminalState).toHaveBeenCalledWith("onboarding finish", {
      resumeStdinIfPaused: false,
    });
  });

  it("restores terminal state without resuming stdin on cancel", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const exitError = new Error("exit");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runtime: RuntimeEnv = {
      log: vi.fn(),
      error: vi.fn(),
      exit: vi.fn(() => {
        throw exitError;
      }) as unknown as RuntimeEnv["exit"],
    };
    mocks.runOnboardingWizard.mockRejectedValueOnce(new WizardCancelledError("cancelled"));

    await expect(runInteractiveOnboarding({} as never, runtime)).rejects.toBe(exitError);

    expect(runtime.exit).toHaveBeenCalledWith(1);
    expect(mocks.restoreTerminalState).toHaveBeenCalledWith("onboarding finish", {
      resumeStdinIfPaused: false,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const restoreOrder =
      mocks.restoreTerminalState.mock.invocationCallOrder[0] ?? Number.MAX_SAFE_INTEGER;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const exitOrder =
      (runtime.exit as unknown as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0] ??
      Number.MAX_SAFE_INTEGER;
    expect(restoreOrder).toBeLessThan(exitOrder);
  });

  it("rethrows non-cancel errors after restoring terminal state", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runtime = makeRuntime();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const err = new Error("boom");
    mocks.runOnboardingWizard.mockRejectedValueOnce(err);

    await expect(runInteractiveOnboarding({} as never, runtime)).rejects.toThrow("boom");

    expect(runtime.exit).not.toHaveBeenCalled();
    expect(mocks.restoreTerminalState).toHaveBeenCalledWith("onboarding finish", {
      resumeStdinIfPaused: false,
    });
  });
});
