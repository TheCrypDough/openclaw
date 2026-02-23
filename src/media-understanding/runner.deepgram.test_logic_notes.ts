/*
 * AUTO ANNOTATION
 * File: src/media-understanding/runner.deepgram.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { buildProviderRegistry, runCapability } from "./runner.js";
import { withAudioFixture } from "./runner.test-utils.js";

describe("runCapability deepgram provider options", () => {
  it("merges provider options, headers, and baseUrl overrides", async () => {
    await withAudioFixture("openclaw-deepgram", async ({ ctx, media, cache }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      let seenQuery: Record<string, string | number | boolean> | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      let seenBaseUrl: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      let seenHeaders: Record<string, string> | undefined;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const providerRegistry = buildProviderRegistry({
        deepgram: {
          id: "deepgram",
          capabilities: ["audio"],
          transcribeAudio: async (req) => {
            seenQuery = req.query;
            seenBaseUrl = req.baseUrl;
            seenHeaders = req.headers;
            return { text: "ok", model: req.model };
          },
        },
      });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const cfg = {
        models: {
          providers: {
            deepgram: {
              baseUrl: "https://provider.example",
              apiKey: "test-key",
              headers: { "X-Provider": "1" },
              models: [],
            },
          },
        },
        tools: {
          media: {
            audio: {
              enabled: true,
              baseUrl: "https://config.example",
              headers: { "X-Config": "2" },
              providerOptions: {
                deepgram: {
                  detect_language: true,
                  punctuate: true,
                },
              },
              deepgram: { smartFormat: true },
              models: [
                {
                  provider: "deepgram",
                  model: "nova-3",
                  baseUrl: "https://entry.example",
                  headers: { "X-Entry": "3" },
                  providerOptions: {
                    deepgram: {
                      detectLanguage: false,
                      punctuate: false,
                      smart_format: true,
                    },
                  },
                },
              ],
            },
          },
        },
      } as unknown as OpenClawConfig;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = await runCapability({
        capability: "audio",
        cfg,
        ctx,
        attachments: cache,
        media,
        providerRegistry,
      });
      expect(result.outputs[0]?.text).toBe("ok");
      expect(seenBaseUrl).toBe("https://entry.example");
      expect(seenHeaders).toMatchObject({
        "X-Provider": "1",
        "X-Config": "2",
        "X-Entry": "3",
      });
      expect(seenQuery).toMatchObject({
        detect_language: false,
        punctuate: false,
        smart_format: true,
      });
      expect((seenQuery as Record<string, unknown>)["detectLanguage"]).toBeUndefined();
    });
  });
});
