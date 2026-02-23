/*
 * AUTO ANNOTATION
 * File: src/slack/probe.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { BaseProbeResult } from "../channels/plugins/types.js";
import { withTimeout } from "../utils/with-timeout.js";
import { createSlackWebClient } from "./client.js";

export type SlackProbe = BaseProbeResult & {
  status?: number | null;
  elapsedMs?: number | null;
  bot?: { id?: string; name?: string };
  team?: { id?: string; name?: string };
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function probeSlack(token: string, timeoutMs = 2500): Promise<SlackProbe> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const client = createSlackWebClient(token);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const start = Date.now();
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await withTimeout(client.auth.test(), timeoutMs);
    if (!result.ok) {
      return {
        ok: false,
        status: 200,
        error: result.error ?? "unknown",
        elapsedMs: Date.now() - start,
      };
    }
    return {
      ok: true,
      status: 200,
      elapsedMs: Date.now() - start,
      bot: { id: result.user_id ?? undefined, name: result.user ?? undefined },
      team: { id: result.team_id ?? undefined, name: result.team ?? undefined },
    };
  } catch (err) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = err instanceof Error ? err.message : String(err);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const status =
      typeof (err as { status?: number }).status === "number"
        ? (err as { status?: number }).status
        : null;
    return {
      ok: false,
      status,
      error: message,
      elapsedMs: Date.now() - start,
    };
  }
}
