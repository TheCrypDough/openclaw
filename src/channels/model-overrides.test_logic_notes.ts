/*
 * AUTO ANNOTATION
 * File: src/channels/model-overrides.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { resolveChannelModelOverride } from "./model-overrides.js";

describe("resolveChannelModelOverride", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cases = [
    {
      name: "matches parent group id when topic suffix is present",
      input: {
        cfg: {
          channels: {
            modelByChannel: {
              telegram: {
                "-100123": "openai/gpt-4.1",
              },
            },
          },
        } as unknown as OpenClawConfig,
        channel: "telegram",
        groupId: "-100123:topic:99",
      },
      expected: { model: "openai/gpt-4.1", matchKey: "-100123" },
    },
    {
      name: "prefers topic-specific match over parent group id",
      input: {
        cfg: {
          channels: {
            modelByChannel: {
              telegram: {
                "-100123": "openai/gpt-4.1",
                "-100123:topic:99": "anthropic/claude-sonnet-4-6",
              },
            },
          },
        } as unknown as OpenClawConfig,
        channel: "telegram",
        groupId: "-100123:topic:99",
      },
      expected: { model: "anthropic/claude-sonnet-4-6", matchKey: "-100123:topic:99" },
    },
    {
      name: "falls back to parent session key when thread id does not match",
      input: {
        cfg: {
          channels: {
            modelByChannel: {
              discord: {
                "123": "openai/gpt-4.1",
              },
            },
          },
        } as unknown as OpenClawConfig,
        channel: "discord",
        groupId: "999",
        parentSessionKey: "agent:main:discord:channel:123:thread:456",
      },
      expected: { model: "openai/gpt-4.1", matchKey: "123" },
    },
  ] as const;

  for (const testCase of cases) {
    it(testCase.name, () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const resolved = resolveChannelModelOverride(testCase.input);
      expect(resolved?.model).toBe(testCase.expected.model);
      expect(resolved?.matchKey).toBe(testCase.expected.matchKey);
    });
  }
});
