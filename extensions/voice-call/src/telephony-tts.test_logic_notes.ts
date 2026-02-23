/*
 * AUTO ANNOTATION
 * File: extensions/voice-call/src/telephony-tts.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it } from "vitest";
import type { VoiceCallTtsConfig } from "./config.js";
import type { CoreConfig } from "./core-bridge.js";
import { createTelephonyTtsProvider } from "./telephony-tts.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createCoreConfig(): CoreConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tts: VoiceCallTtsConfig = {
    provider: "openai",
    openai: {
      model: "gpt-4o-mini-tts",
      voice: "alloy",
    },
  };
  return { messages: { tts } };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function mergeOverride(override: unknown): Promise<Record<string, unknown>> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let mergedConfig: CoreConfig | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const provider = createTelephonyTtsProvider({
    coreConfig: createCoreConfig(),
    ttsOverride: override as VoiceCallTtsConfig,
    runtime: {
      textToSpeechTelephony: async ({ cfg }) => {
        mergedConfig = cfg;
        return {
          success: true,
          audioBuffer: Buffer.alloc(2),
          sampleRate: 8000,
        };
      },
    },
  });

  await provider.synthesizeForTelephony("hello");
  expect(mergedConfig?.messages?.tts).toBeDefined();
  return mergedConfig?.messages?.tts as Record<string, unknown>;
}

afterEach(() => {
  delete (Object.prototype as Record<string, unknown>).polluted;
});

describe("createTelephonyTtsProvider deepMerge hardening", () => {
  it("merges safe nested overrides", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tts = await mergeOverride({
      openai: { voice: "coral" },
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const openai = tts.openai as Record<string, unknown>;

    expect(openai.voice).toBe("coral");
    expect(openai.model).toBe("gpt-4o-mini-tts");
  });

  it("blocks top-level __proto__ keys", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tts = await mergeOverride(
      JSON.parse('{"__proto__":{"polluted":"top"},"openai":{"voice":"coral"}}'),
    );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const openai = tts.openai as Record<string, unknown>;

    expect((Object.prototype as Record<string, unknown>).polluted).toBeUndefined();
    expect(tts.polluted).toBeUndefined();
    expect(openai.voice).toBe("coral");
  });

  it("blocks nested __proto__ keys", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tts = await mergeOverride(
      JSON.parse('{"openai":{"model":"safe","__proto__":{"polluted":"nested"}}}'),
    );
    const openai = tts.openai as Record<string, unknown>;

    expect((Object.prototype as Record<string, unknown>).polluted).toBeUndefined();
    expect(openai.polluted).toBeUndefined();
    expect(openai.model).toBe("safe");
  });
});
