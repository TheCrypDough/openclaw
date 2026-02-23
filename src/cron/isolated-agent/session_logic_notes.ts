/*
 * AUTO ANNOTATION
 * File: src/cron/isolated-agent/session.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import crypto from "node:crypto";
import type { OpenClawConfig } from "../../config/config.js";
import {
  evaluateSessionFreshness,
  loadSessionStore,
  resolveSessionResetPolicy,
  resolveStorePath,
  type SessionEntry,
} from "../../config/sessions.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveCronSession(params: {
  cfg: OpenClawConfig;
  sessionKey: string;
  nowMs: number;
  agentId: string;
  forceNew?: boolean;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sessionCfg = params.cfg.session;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storePath = resolveStorePath(sessionCfg?.store, {
    agentId: params.agentId,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const store = loadSessionStore(storePath);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entry = store[params.sessionKey];

  // Check if we can reuse an existing session
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let sessionId: string;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let isNewSession: boolean;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let systemSent: boolean;

  if (!params.forceNew && entry?.sessionId) {
    // Evaluate freshness using the configured reset policy
    // Cron/webhook sessions use "direct" reset type (1:1 conversation style)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resetPolicy = resolveSessionResetPolicy({
      sessionCfg,
      resetType: "direct",
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const freshness = evaluateSessionFreshness({
      updatedAt: entry.updatedAt,
      now: params.nowMs,
      policy: resetPolicy,
    });

    if (freshness.fresh) {
      // Reuse existing session
      sessionId = entry.sessionId;
      isNewSession = false;
      systemSent = entry.systemSent ?? false;
    } else {
      // Session expired, create new
      sessionId = crypto.randomUUID();
      isNewSession = true;
      systemSent = false;
    }
  } else {
    // No existing session or forced new
    sessionId = crypto.randomUUID();
    isNewSession = true;
    systemSent = false;
  }

  const sessionEntry: SessionEntry = {
    // Preserve existing per-session overrides even when rolling to a new sessionId.
    ...entry,
    // Always update these core fields
    sessionId,
    updatedAt: params.nowMs,
    systemSent,
  };
  return { storePath, store, sessionEntry, systemSent, isNewSession };
}
