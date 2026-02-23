/*
 * AUTO ANNOTATION
 * File: src/commands/sessions.model-resolution.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockSessionsConfig, runSessionsJson, writeStore } from "./sessions.test-helpers.js";

mockSessionsConfig();

import { sessionsCommand } from "./sessions.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SessionsJsonPayload = {
  sessions?: Array<{
    key: string;
    model?: string | null;
  }>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function resolveSubagentModel(
  runtimeFields: Record<string, unknown>,
  sessionId: string,
): Promise<string | null | undefined> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const store = writeStore(
    {
      "agent:research:subagent:demo": {
        sessionId,
        updatedAt: Date.now() - 2 * 60_000,
        ...runtimeFields,
      },
    },
    "sessions-model",
  );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payload = await runSessionsJson<SessionsJsonPayload>(sessionsCommand, store);
  return payload.sessions?.find((row) => row.key === "agent:research:subagent:demo")?.model;
}

describe("sessionsCommand model resolution", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-06T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("prefers runtime model fields for subagent sessions in JSON output", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const model = await resolveSubagentModel(
      {
        modelProvider: "openai-codex",
        model: "gpt-5.3-codex",
        modelOverride: "pi:opus",
      },
      "subagent-1",
    );
    expect(model).toBe("gpt-5.3-codex");
  });

  it("falls back to modelOverride when runtime model is missing", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const model = await resolveSubagentModel(
      { modelOverride: "openai-codex/gpt-5.3-codex" },
      "subagent-2",
    );
    expect(model).toBe("gpt-5.3-codex");
  });
});
