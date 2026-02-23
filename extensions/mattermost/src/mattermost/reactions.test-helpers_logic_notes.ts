/*
 * AUTO ANNOTATION
 * File: extensions/mattermost/src/mattermost/reactions.test-helpers.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "openclaw/plugin-sdk";
import { expect, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createMattermostTestConfig(): OpenClawConfig {
  return {
    channels: {
      mattermost: {
        enabled: true,
        botToken: "test-token",
        baseUrl: "https://chat.example.com",
      },
    },
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createMattermostReactionFetchMock(params: {
  postId: string;
  emojiName: string;
  mode: "add" | "remove" | "both";
  userId?: string;
  status?: number;
  body?: unknown;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const userId = params.userId ?? "BOT123";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mode = params.mode;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowAdd = mode === "add" || mode === "both";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allowRemove = mode === "remove" || mode === "both";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const addStatus = params.status ?? 201;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const removeStatus = params.status ?? 204;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const removePath = `/api/v4/users/${userId}/posts/${params.postId}/reactions/${encodeURIComponent(params.emojiName)}`;

  return vi.fn(async (url: any, init?: any) => {
    if (String(url).endsWith("/api/v4/users/me")) {
      return new Response(JSON.stringify({ id: userId }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    if (allowAdd && String(url).endsWith("/api/v4/reactions")) {
      expect(init?.method).toBe("POST");
      expect(JSON.parse(init?.body)).toEqual({
        user_id: userId,
        post_id: params.postId,
        emoji_name: params.emojiName,
      });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const responseBody = params.body === undefined ? { ok: true } : params.body;
      return new Response(
        responseBody === null ? null : JSON.stringify(responseBody),
        responseBody === null
          ? { status: addStatus, headers: { "content-type": "text/plain" } }
          : { status: addStatus, headers: { "content-type": "application/json" } },
      );
    }

    if (allowRemove && String(url).endsWith(removePath)) {
      expect(init?.method).toBe("DELETE");
      const responseBody = params.body === undefined ? null : params.body;
      return new Response(
        responseBody === null ? null : JSON.stringify(responseBody),
        responseBody === null
          ? { status: removeStatus, headers: { "content-type": "text/plain" } }
          : { status: removeStatus, headers: { "content-type": "application/json" } },
      );
    }

    throw new Error(`unexpected url: ${url}`);
  });
}

export async function withMockedGlobalFetch<T>(
  fetchImpl: typeof fetch,
  run: () => Promise<T>,
): Promise<T> {
  const prevFetch = globalThis.fetch;
  (globalThis as any).fetch = fetchImpl;
  try {
    return await run();
  } finally {
    (globalThis as any).fetch = prevFetch;
  }
}
