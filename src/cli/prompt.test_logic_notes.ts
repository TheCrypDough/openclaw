/*
 * AUTO ANNOTATION
 * File: src/cli/prompt.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { isYes, setVerbose, setYes } from "../globals.js";

vi.mock("node:readline/promises", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const question = vi.fn(async () => "");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const close = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const createInterface = vi.fn(() => ({ question, close }));
  return { default: { createInterface } };
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ReadlineMock = {
  default: {
    createInterface: () => {
      question: ReturnType<typeof vi.fn>;
      close: ReturnType<typeof vi.fn>;
    };
  };
};

const { promptYesNo } = await import("./prompt.js");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const readline = (await import("node:readline/promises")) as unknown as ReadlineMock;

describe("promptYesNo", () => {
  it("returns true when global --yes is set", async () => {
    setYes(true);
    setVerbose(false);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await promptYesNo("Continue?");
    expect(result).toBe(true);
    expect(isYes()).toBe(true);
  });

  it("asks the question and respects default", async () => {
    setYes(false);
    setVerbose(false);
    const { question: questionMock } = readline.default.createInterface();
    questionMock.mockResolvedValueOnce("");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resultDefaultYes = await promptYesNo("Continue?", true);
    expect(resultDefaultYes).toBe(true);

    questionMock.mockResolvedValueOnce("n");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resultNo = await promptYesNo("Continue?", true);
    expect(resultNo).toBe(false);

    questionMock.mockResolvedValueOnce("y");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resultYes = await promptYesNo("Continue?", false);
    expect(resultYes).toBe(true);
  });
});
