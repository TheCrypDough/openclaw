/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/onboarding/helpers.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { promptResolvedAllowFrom } from "./helpers.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createPrompter(inputs: string[]) {
  return {
    text: vi.fn(async () => inputs.shift() ?? ""),
    note: vi.fn(async () => undefined),
  };
}

describe("promptResolvedAllowFrom", () => {
  it("re-prompts without token until all ids are parseable", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prompter = createPrompter(["@alice", "123"]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolveEntries = vi.fn();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await promptResolvedAllowFrom({
      // oxlint-disable-next-line typescript/no-explicit-any
      prompter: prompter as any,
      existing: ["111"],
      token: "",
      message: "msg",
      placeholder: "placeholder",
      label: "allowlist",
      parseInputs: (value) =>
        value
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean),
      parseId: (value) => (/^\d+$/.test(value.trim()) ? value.trim() : null),
      invalidWithoutTokenNote: "ids only",
      // oxlint-disable-next-line typescript/no-explicit-any
      resolveEntries: resolveEntries as any,
    });

    expect(result).toEqual(["111", "123"]);
    expect(prompter.note).toHaveBeenCalledWith("ids only", "allowlist");
    expect(resolveEntries).not.toHaveBeenCalled();
  });

  it("re-prompts when token resolution returns unresolved entries", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prompter = createPrompter(["alice", "bob"]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolveEntries = vi
      .fn()
      .mockResolvedValueOnce([{ input: "alice", resolved: false }])
      .mockResolvedValueOnce([{ input: "bob", resolved: true, id: "U123" }]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await promptResolvedAllowFrom({
      // oxlint-disable-next-line typescript/no-explicit-any
      prompter: prompter as any,
      existing: [],
      token: "xoxb-test",
      message: "msg",
      placeholder: "placeholder",
      label: "allowlist",
      parseInputs: (value) =>
        value
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean),
      parseId: () => null,
      invalidWithoutTokenNote: "ids only",
      resolveEntries,
    });

    expect(result).toEqual(["U123"]);
    expect(prompter.note).toHaveBeenCalledWith("Could not resolve: alice", "allowlist");
    expect(resolveEntries).toHaveBeenCalledTimes(2);
  });
});
