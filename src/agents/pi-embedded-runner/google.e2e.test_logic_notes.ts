/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-runner/google.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AgentTool } from "@mariozechner/pi-agent-core";
import { describe, expect, it } from "vitest";
import { sanitizeToolsForGoogle } from "./google.js";

describe("sanitizeToolsForGoogle", () => {
  it("strips unsupported schema keywords for Google providers", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tool = {
      name: "test",
      description: "test",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          foo: {
            type: "string",
            format: "uuid",
          },
        },
      },
      execute: async () => ({ ok: true, content: [] }),
    } as unknown as AgentTool;

    const [sanitized] = sanitizeToolsForGoogle({
      tools: [tool],
      provider: "google-gemini-cli",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const params = sanitized.parameters as {
      additionalProperties?: unknown;
      properties?: Record<string, { format?: unknown }>;
    };

    expect(params.additionalProperties).toBeUndefined();
    expect(params.properties?.foo?.format).toBeUndefined();
  });

  it("strips unsupported schema keywords for google-antigravity", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tool = {
      name: "test",
      description: "test",
      parameters: {
        type: "object",
        patternProperties: {
          "^x-": { type: "string" },
        },
        properties: {
          foo: {
            type: "string",
            format: "uuid",
          },
        },
      },
      execute: async () => ({ ok: true, content: [] }),
    } as unknown as AgentTool;

    const [sanitized] = sanitizeToolsForGoogle({
      tools: [tool],
      provider: "google-antigravity",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const params = sanitized.parameters as {
      patternProperties?: unknown;
      properties?: Record<string, { format?: unknown }>;
    };

    expect(params.patternProperties).toBeUndefined();
    expect(params.properties?.foo?.format).toBeUndefined();
  });
});
