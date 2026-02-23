/*
 * AUTO ANNOTATION
 * File: src/media-understanding/providers/deepgram/audio.live.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { isTruthyEnvValue } from "../../../infra/env.js";
import { transcribeDeepgramAudio } from "./audio.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEEPGRAM_KEY = process.env.DEEPGRAM_API_KEY ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEEPGRAM_MODEL = process.env.DEEPGRAM_MODEL?.trim() || "nova-3";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEEPGRAM_BASE_URL = process.env.DEEPGRAM_BASE_URL?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SAMPLE_URL =
  process.env.DEEPGRAM_SAMPLE_URL?.trim() ||
  "https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const LIVE =
  isTruthyEnvValue(process.env.DEEPGRAM_LIVE_TEST) ||
  isTruthyEnvValue(process.env.LIVE) ||
  isTruthyEnvValue(process.env.OPENCLAW_LIVE_TEST);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const describeLive = LIVE && DEEPGRAM_KEY ? describe : describe.skip;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function fetchSampleBuffer(url: string, timeoutMs: number): Promise<Buffer> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const controller = new AbortController();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const timer = setTimeout(() => controller.abort(), Math.max(1, timeoutMs));
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Sample download failed (HTTP ${res.status})`);
    }
    const data = await res.arrayBuffer();
    return Buffer.from(data);
  } finally {
    clearTimeout(timer);
  }
}

describeLive("deepgram live", () => {
  it("transcribes sample audio", async () => {
    const buffer = await fetchSampleBuffer(SAMPLE_URL, 15000);
    const result = await transcribeDeepgramAudio({
      buffer,
      fileName: "sample.wav",
      mime: "audio/wav",
      apiKey: DEEPGRAM_KEY,
      model: DEEPGRAM_MODEL,
      baseUrl: DEEPGRAM_BASE_URL,
      timeoutMs: 20000,
    });
    expect(result.text.trim().length).toBeGreaterThan(0);
  }, 30000);
});
