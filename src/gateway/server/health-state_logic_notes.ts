/*
 * AUTO ANNOTATION
 * File: src/gateway/server/health-state.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveDefaultAgentId } from "../../agents/agent-scope.js";
import { getHealthSnapshot, type HealthSummary } from "../../commands/health.js";
import { CONFIG_PATH, STATE_DIR, loadConfig } from "../../config/config.js";
import { resolveMainSessionKey } from "../../config/sessions.js";
import { listSystemPresence } from "../../infra/system-presence.js";
import { getUpdateAvailable } from "../../infra/update-startup.js";
import { normalizeMainKey } from "../../routing/session-key.js";
import { resolveGatewayAuth } from "../auth.js";
import type { Snapshot } from "../protocol/index.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let presenceVersion = 1;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let healthVersion = 1;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let healthCache: HealthSummary | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let healthRefresh: Promise<HealthSummary> | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let broadcastHealthUpdate: ((snap: HealthSummary) => void) | null = null;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildGatewaySnapshot(): Snapshot {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const defaultAgentId = resolveDefaultAgentId(cfg);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mainKey = normalizeMainKey(cfg.session?.mainKey);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mainSessionKey = resolveMainSessionKey(cfg);
  const scope = cfg.session?.scope ?? "per-sender";
  const presence = listSystemPresence();
  const uptimeMs = Math.round(process.uptime() * 1000);
  const auth = resolveGatewayAuth({ authConfig: cfg.gateway?.auth, env: process.env });
  const updateAvailable = getUpdateAvailable() ?? undefined;
  // Health is async; caller should await getHealthSnapshot and replace later if needed.
  const emptyHealth: unknown = {};
  return {
    presence,
    health: emptyHealth,
    stateVersion: { presence: presenceVersion, health: healthVersion },
    uptimeMs,
    // Surface resolved paths so UIs can display the true config location.
    configPath: CONFIG_PATH,
    stateDir: STATE_DIR,
    sessionDefaults: {
      defaultAgentId,
      mainKey,
      mainSessionKey,
      scope,
    },
    authMode: auth.mode,
    updateAvailable,
  };
}

export function getHealthCache(): HealthSummary | null {
  return healthCache;
}

export function getHealthVersion(): number {
  return healthVersion;
}

export function incrementPresenceVersion(): number {
  presenceVersion += 1;
  return presenceVersion;
}

export function getPresenceVersion(): number {
  return presenceVersion;
}

export function setBroadcastHealthUpdate(fn: ((snap: HealthSummary) => void) | null) {
  broadcastHealthUpdate = fn;
}

export async function refreshGatewayHealthSnapshot(opts?: { probe?: boolean }) {
  if (!healthRefresh) {
    healthRefresh = (async () => {
      const snap = await getHealthSnapshot({ probe: opts?.probe });
      healthCache = snap;
      healthVersion += 1;
      if (broadcastHealthUpdate) {
        broadcastHealthUpdate(snap);
      }
      return snap;
    })().finally(() => {
      healthRefresh = null;
    });
  }
  return healthRefresh;
}
