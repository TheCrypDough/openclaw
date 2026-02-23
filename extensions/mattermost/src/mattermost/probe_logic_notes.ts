/*
 * AUTO ANNOTATION
 * File: extensions/mattermost/src/mattermost/probe.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { BaseProbeResult } from "openclaw/plugin-sdk";
import { normalizeMattermostBaseUrl, type MattermostUser } from "./client.js";

export type MattermostProbe = BaseProbeResult & {
  status?: number | null;
  elapsedMs?: number | null;
  bot?: MattermostUser;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function readMattermostError(res: Response): Promise<string> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const data = (await res.json()) as { message?: string } | undefined;
    if (data?.message) {
      return data.message;
    }
    return JSON.stringify(data);
  }
  return await res.text();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function probeMattermost(
  baseUrl: string,
  botToken: string,
  timeoutMs = 2500,
): Promise<MattermostProbe> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeMattermostBaseUrl(baseUrl);
  if (!normalized) {
    return { ok: false, error: "baseUrl missing" };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const url = `${normalized}/api/v4/users/me`;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const start = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const controller = timeoutMs > 0 ? new AbortController() : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let timer: NodeJS.Timeout | null = null;
  if (controller) {
    timer = setTimeout(() => controller.abort(), timeoutMs);
  }
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${botToken}` },
      signal: controller?.signal,
    });
    const elapsedMs = Date.now() - start;
    if (!res.ok) {
      const detail = await readMattermostError(res);
      return {
        ok: false,
        status: res.status,
        error: detail || res.statusText,
        elapsedMs,
      };
    }
    const bot = (await res.json()) as MattermostUser;
    return {
      ok: true,
      status: res.status,
      elapsedMs,
      bot,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      status: null,
      error: message,
      elapsedMs: Date.now() - start,
    };
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
