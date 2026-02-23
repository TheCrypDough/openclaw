/*
 * AUTO ANNOTATION
 * File: src/media-understanding/providers/google/inline-data.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeGoogleModelId } from "../../../agents/models-config.providers.js";
import { parseGeminiAuth } from "../../../infra/gemini-auth.js";
import { assertOkOrThrowHttpError, fetchWithTimeoutGuarded, normalizeBaseUrl } from "../shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function generateGeminiInlineDataText(params: {
  buffer: Buffer;
  mime?: string;
  apiKey: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  model?: string;
  prompt?: string;
  timeoutMs: number;
  fetchFn?: typeof fetch;
  defaultBaseUrl: string;
  defaultModel: string;
  defaultPrompt: string;
  defaultMime: string;
  httpErrorLabel: string;
  missingTextError: string;
}): Promise<{ text: string; model: string }> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fetchFn = params.fetchFn ?? fetch;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const baseUrl = normalizeBaseUrl(params.baseUrl, params.defaultBaseUrl);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowPrivate = Boolean(params.baseUrl?.trim());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const model = (() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const trimmed = params.model?.trim();
    if (!trimmed) {
      return params.defaultModel;
    }
    return normalizeGoogleModelId(trimmed);
  })();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const url = `${baseUrl}/models/${model}:generateContent`;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const authHeaders = parseGeminiAuth(params.apiKey);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const headers = new Headers(params.headers);
  for (const [key, value] of Object.entries(authHeaders.headers)) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prompt = (() => {
    const trimmed = params.prompt?.trim();
    return trimmed || params.defaultPrompt;
  })();

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: params.mime ?? params.defaultMime,
              data: params.buffer.toString("base64"),
            },
          },
        ],
      },
    ],
  };

  const { response: res, release } = await fetchWithTimeoutGuarded(
    url,
    {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    },
    params.timeoutMs,
    fetchFn,
    allowPrivate ? { ssrfPolicy: { allowPrivateNetwork: true } } : undefined,
  );

  try {
    await assertOkOrThrowHttpError(res, params.httpErrorLabel);

    const payload = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const parts = payload.candidates?.[0]?.content?.parts ?? [];
    const text = parts
      .map((part) => part?.text?.trim())
      .filter(Boolean)
      .join("\n");
    if (!text) {
      throw new Error(params.missingTextError);
    }
    return { text, model };
  } finally {
    await release();
  }
}
