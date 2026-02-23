/*
 * AUTO ANNOTATION
 * File: src/agents/tools/sessions-announce-target.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getChannelPlugin, normalizeChannelId } from "../../channels/plugins/index.js";
import { callGateway } from "../../gateway/call.js";
import { SessionListRow } from "./sessions-helpers.js";
import type { AnnounceTarget } from "./sessions-send-helpers.js";
import { resolveAnnounceTargetFromKey } from "./sessions-send-helpers.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveAnnounceTarget(params: {
  sessionKey: string;
  displayKey: string;
}): Promise<AnnounceTarget | null> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = resolveAnnounceTargetFromKey(params.sessionKey);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsedDisplay = resolveAnnounceTargetFromKey(params.displayKey);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fallback = parsed ?? parsedDisplay ?? null;

  if (fallback) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalizeChannelId(fallback.channel);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const plugin = normalized ? getChannelPlugin(normalized) : null;
    if (!plugin?.meta?.preferSessionLookupForAnnounceTarget) {
      return fallback;
    }
  }

  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const list = await callGateway<{ sessions: Array<SessionListRow> }>({
      method: "sessions.list",
      params: {
        includeGlobal: true,
        includeUnknown: true,
        limit: 200,
      },
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sessions = Array.isArray(list?.sessions) ? list.sessions : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const match =
      sessions.find((entry) => entry?.key === params.sessionKey) ??
      sessions.find((entry) => entry?.key === params.displayKey);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const deliveryContext =
      match?.deliveryContext && typeof match.deliveryContext === "object"
        ? (match.deliveryContext as Record<string, unknown>)
        : undefined;
    const channel =
      (typeof deliveryContext?.channel === "string" ? deliveryContext.channel : undefined) ??
      (typeof match?.lastChannel === "string" ? match.lastChannel : undefined);
    const to =
      (typeof deliveryContext?.to === "string" ? deliveryContext.to : undefined) ??
      (typeof match?.lastTo === "string" ? match.lastTo : undefined);
    const accountId =
      (typeof deliveryContext?.accountId === "string" ? deliveryContext.accountId : undefined) ??
      (typeof match?.lastAccountId === "string" ? match.lastAccountId : undefined);
    if (channel && to) {
      return { channel, to, accountId };
    }
  } catch {
    // ignore
  }

  return fallback;
}
