/*
 * AUTO ANNOTATION
 * File: src/slack/scopes.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { WebClient } from "@slack/web-api";
import { isRecord } from "../utils.js";
import { createSlackWebClient } from "./client.js";

export type SlackScopesResult = {
  ok: boolean;
  scopes?: string[];
  source?: string;
  error?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SlackScopesSource = "auth.scopes" | "apps.permissions.info";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function collectScopes(value: unknown, into: string[]) {
  if (!value) {
    return;
  }
  if (Array.isArray(value)) {
    for (const entry of value) {
      if (typeof entry === "string" && entry.trim()) {
        into.push(entry.trim());
      }
    }
    return;
  }
  if (typeof value === "string") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = value.trim();
    if (!raw) {
      return;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parts = raw.split(/[,\s]+/).map((part) => part.trim());
    for (const part of parts) {
      if (part) {
        into.push(part);
      }
    }
    return;
  }
  if (!isRecord(value)) {
    return;
  }
  for (const entry of Object.values(value)) {
    if (Array.isArray(entry) || typeof entry === "string") {
      collectScopes(entry, into);
    }
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeScopes(scopes: string[]) {
  return Array.from(new Set(scopes.map((scope) => scope.trim()).filter(Boolean))).toSorted();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function extractScopes(payload: unknown): string[] {
  if (!isRecord(payload)) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const scopes: string[] = [];
  collectScopes(payload.scopes, scopes);
  collectScopes(payload.scope, scopes);
  if (isRecord(payload.info)) {
    collectScopes(payload.info.scopes, scopes);
    collectScopes(payload.info.scope, scopes);
    collectScopes((payload.info as { user_scopes?: unknown }).user_scopes, scopes);
    collectScopes((payload.info as { bot_scopes?: unknown }).bot_scopes, scopes);
  }
  return normalizeScopes(scopes);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function readError(payload: unknown): string | undefined {
  if (!isRecord(payload)) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const error = payload.error;
  return typeof error === "string" && error.trim() ? error.trim() : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function callSlack(
  client: WebClient,
  method: SlackScopesSource,
): Promise<Record<string, unknown> | null> {
  try {
    const result = await client.apiCall(method);
    return isRecord(result) ? result : null;
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function fetchSlackScopes(
  token: string,
  timeoutMs: number,
): Promise<SlackScopesResult> {
  const client = createSlackWebClient(token, { timeout: timeoutMs });
  const attempts: SlackScopesSource[] = ["auth.scopes", "apps.permissions.info"];
  const errors: string[] = [];

  for (const method of attempts) {
    const result = await callSlack(client, method);
    const scopes = extractScopes(result);
    if (scopes.length > 0) {
      return { ok: true, scopes, source: method };
    }
    const error = readError(result);
    if (error) {
      errors.push(`${method}: ${error}`);
    }
  }

  return {
    ok: false,
    error: errors.length > 0 ? errors.join(" | ") : "no scopes returned",
  };
}
