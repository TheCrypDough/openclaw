/*
 * AUTO ANNOTATION
 * File: src/infra/tailnet.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import os from "node:os";

export type TailnetAddresses = {
  ipv4: string[];
  ipv6: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isTailnetIPv4(address: string): boolean {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parts = address.split(".");
  if (parts.length !== 4) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const octets = parts.map((p) => Number.parseInt(p, 10));
  if (octets.some((n) => !Number.isFinite(n) || n < 0 || n > 255)) {
    return false;
  }

  // Tailscale IPv4 range: 100.64.0.0/10
  // https://tailscale.com/kb/1015/100.x-addresses
  const [a, b] = octets;
  return a === 100 && b >= 64 && b <= 127;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function isTailnetIPv6(address: string): boolean {
  // Tailscale IPv6 ULA prefix: fd7a:115c:a1e0::/48
  // (stable across tailnets; nodes get per-device suffixes)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = address.trim().toLowerCase();
  return normalized.startsWith("fd7a:115c:a1e0:");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function listTailnetAddresses(): TailnetAddresses {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ipv4: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ipv6: string[] = [];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ifaces = os.networkInterfaces();
  for (const entries of Object.values(ifaces)) {
    if (!entries) {
      continue;
    }
    for (const e of entries) {
      if (!e || e.internal) {
        continue;
      }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const address = e.address?.trim();
      if (!address) {
        continue;
      }
      if (isTailnetIPv4(address)) {
        ipv4.push(address);
      }
      if (isTailnetIPv6(address)) {
        ipv6.push(address);
      }
    }
  }

  return { ipv4: [...new Set(ipv4)], ipv6: [...new Set(ipv6)] };
}

export function pickPrimaryTailnetIPv4(): string | undefined {
  return listTailnetAddresses().ipv4[0];
}

export function pickPrimaryTailnetIPv6(): string | undefined {
  return listTailnetAddresses().ipv6[0];
}
