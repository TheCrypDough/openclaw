/*
 * AUTO ANNOTATION
 * File: src/channels/mention-gating.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { resolveMentionGating, resolveMentionGatingWithBypass } from "./mention-gating.js";

describe("resolveMentionGating", () => {
  it("combines explicit, implicit, and bypass mentions", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = resolveMentionGating({
      requireMention: true,
      canDetectMention: true,
      wasMentioned: false,
      implicitMention: true,
      shouldBypassMention: false,
    });
    expect(res.effectiveWasMentioned).toBe(true);
    expect(res.shouldSkip).toBe(false);
  });

  it("skips when mention required and none detected", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = resolveMentionGating({
      requireMention: true,
      canDetectMention: true,
      wasMentioned: false,
      implicitMention: false,
      shouldBypassMention: false,
    });
    expect(res.effectiveWasMentioned).toBe(false);
    expect(res.shouldSkip).toBe(true);
  });

  it("does not skip when mention detection is unavailable", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = resolveMentionGating({
      requireMention: true,
      canDetectMention: false,
      wasMentioned: false,
    });
    expect(res.shouldSkip).toBe(false);
  });
});

describe("resolveMentionGatingWithBypass", () => {
  it("enables bypass when control commands are authorized", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = resolveMentionGatingWithBypass({
      isGroup: true,
      requireMention: true,
      canDetectMention: true,
      wasMentioned: false,
      hasAnyMention: false,
      allowTextCommands: true,
      hasControlCommand: true,
      commandAuthorized: true,
    });
    expect(res.shouldBypassMention).toBe(true);
    expect(res.shouldSkip).toBe(false);
  });

  it("does not bypass when control commands are not authorized", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = resolveMentionGatingWithBypass({
      isGroup: true,
      requireMention: true,
      canDetectMention: true,
      wasMentioned: false,
      hasAnyMention: false,
      allowTextCommands: true,
      hasControlCommand: true,
      commandAuthorized: false,
    });
    expect(res.shouldBypassMention).toBe(false);
    expect(res.shouldSkip).toBe(true);
  });
});
