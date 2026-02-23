/*
 * AUTO ANNOTATION
 * File: src/media-understanding/providers/deepgram/audio.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AudioTranscriptionRequest, AudioTranscriptionResult } from "../../types.js";
import { assertOkOrThrowHttpError, fetchWithTimeoutGuarded, normalizeBaseUrl } from "../shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_DEEPGRAM_AUDIO_BASE_URL = "https://api.deepgram.com/v1";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const DEFAULT_DEEPGRAM_AUDIO_MODEL = "nova-3";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveModel(model?: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = model?.trim();
  return trimmed || DEFAULT_DEEPGRAM_AUDIO_MODEL;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DeepgramTranscriptResponse = {
  results?: {
    channels?: Array<{
      alternatives?: Array<{
        transcript?: string;
      }>;
    }>;
  };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function transcribeDeepgramAudio(
  params: AudioTranscriptionRequest,
): Promise<AudioTranscriptionResult> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fetchFn = params.fetchFn ?? fetch;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseUrl = normalizeBaseUrl(params.baseUrl, DEFAULT_DEEPGRAM_AUDIO_BASE_URL);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowPrivate = Boolean(params.baseUrl?.trim());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const model = resolveModel(params.model);

  const url = new URL(`${baseUrl}/listen`);
  url.searchParams.set("model", model);
  if (params.language?.trim()) {
    url.searchParams.set("language", params.language.trim());
  }
  if (params.query) {
    for (const [key, value] of Object.entries(params.query)) {
      if (value === undefined) {
        continue;
      }
      url.searchParams.set(key, String(value));
    }
  }

  const headers = new Headers(params.headers);
  if (!headers.has("authorization")) {
    headers.set("authorization", `Token ${params.apiKey}`);
  }
  if (!headers.has("content-type")) {
    headers.set("content-type", params.mime ?? "application/octet-stream");
  }

  const body = new Uint8Array(params.buffer);
  const { response: res, release } = await fetchWithTimeoutGuarded(
    url.toString(),
    {
      method: "POST",
      headers,
      body,
    },
    params.timeoutMs,
    fetchFn,
    allowPrivate ? { ssrfPolicy: { allowPrivateNetwork: true } } : undefined,
  );

  try {
    await assertOkOrThrowHttpError(res, "Audio transcription failed");

    const payload = (await res.json()) as DeepgramTranscriptResponse;
    const transcript = payload.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim();
    if (!transcript) {
      throw new Error("Audio transcription response missing transcript");
    }
    return { text: transcript, model };
  } finally {
    await release();
  }
}
