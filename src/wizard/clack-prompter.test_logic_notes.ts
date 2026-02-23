/*
 * AUTO ANNOTATION
 * File: src/wizard/clack-prompter.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { tokenizedOptionFilter } from "./clack-prompter.js";

describe("tokenizedOptionFilter", () => {
  it("matches tokens regardless of order", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const option = {
      value: "openai/gpt-5.2",
      label: "openai/gpt-5.2",
      hint: "ctx 400k",
    };

    expect(tokenizedOptionFilter("gpt-5.2 openai/", option)).toBe(true);
    expect(tokenizedOptionFilter("openai/ gpt-5.2", option)).toBe(true);
  });

  it("requires all tokens to match", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const option = {
      value: "openai/gpt-5.2",
      label: "openai/gpt-5.2",
    };

    expect(tokenizedOptionFilter("gpt-5.2 anthropic/", option)).toBe(false);
  });

  it("matches against label, hint, and value", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const option = {
      value: "openai/gpt-5.2",
      label: "GPT 5.2",
      hint: "provider openai",
    };

    expect(tokenizedOptionFilter("provider openai", option)).toBe(true);
    expect(tokenizedOptionFilter("openai gpt-5.2", option)).toBe(true);
  });
});
