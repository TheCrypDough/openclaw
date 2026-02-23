/*
 * AUTO ANNOTATION
 * File: src/commands/gateway-presence.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type GatewaySelfPresence = {
  host?: string;
  ip?: string;
  version?: string;
  platform?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function pickGatewaySelfPresence(presence: unknown): GatewaySelfPresence | null {
  if (!Array.isArray(presence)) {
    return null;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries = presence as Array<Record<string, unknown>>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const self =
    entries.find((e) => e.mode === "gateway" && e.reason === "self") ??
    // Back-compat: older presence payloads only included a `text` line.
    entries.find((e) => typeof e.text === "string" && String(e.text).startsWith("Gateway:")) ??
    null;
  if (!self) {
    return null;
  }
  return {
    host: typeof self.host === "string" ? self.host : undefined,
    ip: typeof self.ip === "string" ? self.ip : undefined,
    version: typeof self.version === "string" ? self.version : undefined,
    platform: typeof self.platform === "string" ? self.platform : undefined,
  };
}
