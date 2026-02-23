/*
 * AUTO ANNOTATION
 * File: src/utils/reaction-level.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { resolveReactionLevel } from "./reaction-level.js";

describe("resolveReactionLevel", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cases = [
    {
      name: "defaults when value is missing",
      input: {
        value: undefined,
        defaultLevel: "minimal" as const,
        invalidFallback: "ack" as const,
      },
      expected: {
        level: "minimal",
        ackEnabled: false,
        agentReactionsEnabled: true,
        agentReactionGuidance: "minimal",
      },
    },
    {
      name: "supports ack",
      input: { value: "ack", defaultLevel: "minimal" as const, invalidFallback: "ack" as const },
      expected: { level: "ack", ackEnabled: true, agentReactionsEnabled: false },
    },
    {
      name: "supports extensive",
      input: {
        value: "extensive",
        defaultLevel: "minimal" as const,
        invalidFallback: "ack" as const,
      },
      expected: {
        level: "extensive",
        ackEnabled: false,
        agentReactionsEnabled: true,
        agentReactionGuidance: "extensive",
      },
    },
    {
      name: "uses invalid fallback ack",
      input: { value: "bogus", defaultLevel: "minimal" as const, invalidFallback: "ack" as const },
      expected: { level: "ack", ackEnabled: true, agentReactionsEnabled: false },
    },
    {
      name: "uses invalid fallback minimal",
      input: {
        value: "bogus",
        defaultLevel: "minimal" as const,
        invalidFallback: "minimal" as const,
      },
      expected: {
        level: "minimal",
        ackEnabled: false,
        agentReactionsEnabled: true,
        agentReactionGuidance: "minimal",
      },
    },
  ] as const;

  for (const testCase of cases) {
    it(testCase.name, () => {
      expect(resolveReactionLevel(testCase.input)).toEqual(testCase.expected);
    });
  }
});
