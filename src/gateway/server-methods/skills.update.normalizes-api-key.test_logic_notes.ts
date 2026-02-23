/*
 * AUTO ANNOTATION
 * File: src/gateway/server-methods/skills.update.normalizes-api-key.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let writtenConfig: unknown = null;

vi.mock("../../config/config.js", () => {
  return {
    loadConfig: () => ({
      skills: {
        entries: {},
      },
    }),
    writeConfigFile: async (cfg: unknown) => {
      writtenConfig = cfg;
    },
  };
});

const { skillsHandlers } = await import("./skills.js");

describe("skills.update", () => {
  it("strips embedded CR/LF from apiKey", async () => {
    writtenConfig = null;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let ok: boolean | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let error: unknown = null;
    await skillsHandlers["skills.update"]({
      params: {
        skillKey: "brave-search",
        apiKey: "abc\r\ndef",
      },
      req: {} as never,
      client: null as never,
      isWebchatConnect: () => false,
      context: {} as never,
      respond: (success, _result, err) => {
        ok = success;
        error = err;
      },
    });

    expect(ok).toBe(true);
    expect(error).toBeUndefined();
    expect(writtenConfig).toMatchObject({
      skills: {
        entries: {
          "brave-search": {
            apiKey: "abcdef",
          },
        },
      },
    });
  });
});
