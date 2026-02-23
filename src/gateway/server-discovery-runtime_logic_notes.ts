/*
 * AUTO ANNOTATION
 * File: src/gateway/server-discovery-runtime.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { startGatewayBonjourAdvertiser } from "../infra/bonjour.js";
import { pickPrimaryTailnetIPv4, pickPrimaryTailnetIPv6 } from "../infra/tailnet.js";
import { resolveWideAreaDiscoveryDomain, writeWideAreaGatewayZone } from "../infra/widearea-dns.js";
import {
  formatBonjourInstanceName,
  resolveBonjourCliPath,
  resolveTailnetDnsHint,
} from "./server-discovery.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function startGatewayDiscovery(params: {
  machineDisplayName: string;
  port: number;
  gatewayTls?: { enabled: boolean; fingerprintSha256?: string };
  canvasPort?: number;
  wideAreaDiscoveryEnabled: boolean;
  wideAreaDiscoveryDomain?: string | null;
  tailscaleMode: "off" | "serve" | "funnel";
  /** mDNS/Bonjour discovery mode (default: minimal). */
  mdnsMode?: "off" | "minimal" | "full";
  logDiscovery: { info: (msg: string) => void; warn: (msg: string) => void };
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let bonjourStop: (() => Promise<void>) | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mdnsMode = params.mdnsMode ?? "minimal";
  // mDNS can be disabled via config (mdnsMode: off) or env var.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const bonjourEnabled =
    mdnsMode !== "off" &&
    process.env.OPENCLAW_DISABLE_BONJOUR !== "1" &&
    process.env.NODE_ENV !== "test" &&
    !process.env.VITEST;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mdnsMinimal = mdnsMode !== "full";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tailscaleEnabled = params.tailscaleMode !== "off";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const needsTailnetDns = bonjourEnabled || params.wideAreaDiscoveryEnabled;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tailnetDns = needsTailnetDns
    ? await resolveTailnetDnsHint({ enabled: tailscaleEnabled })
    : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sshPortEnv = mdnsMinimal ? undefined : process.env.OPENCLAW_SSH_PORT?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sshPortParsed = sshPortEnv ? Number.parseInt(sshPortEnv, 10) : NaN;
  const sshPort = Number.isFinite(sshPortParsed) && sshPortParsed > 0 ? sshPortParsed : undefined;
  const cliPath = mdnsMinimal ? undefined : resolveBonjourCliPath();

  if (bonjourEnabled) {
    try {
      const bonjour = await startGatewayBonjourAdvertiser({
        instanceName: formatBonjourInstanceName(params.machineDisplayName),
        gatewayPort: params.port,
        gatewayTlsEnabled: params.gatewayTls?.enabled ?? false,
        gatewayTlsFingerprintSha256: params.gatewayTls?.fingerprintSha256,
        canvasPort: params.canvasPort,
        sshPort,
        tailnetDns,
        cliPath,
        minimal: mdnsMinimal,
      });
      bonjourStop = bonjour.stop;
    } catch (err) {
      params.logDiscovery.warn(`bonjour advertising failed: ${String(err)}`);
    }
  }

  if (params.wideAreaDiscoveryEnabled) {
    const wideAreaDomain = resolveWideAreaDiscoveryDomain({
      configDomain: params.wideAreaDiscoveryDomain ?? undefined,
    });
    if (!wideAreaDomain) {
      params.logDiscovery.warn(
        "discovery.wideArea.enabled is true, but no domain was configured; set discovery.wideArea.domain to enable unicast DNS-SD",
      );
      return { bonjourStop };
    }
    const tailnetIPv4 = pickPrimaryTailnetIPv4();
    if (!tailnetIPv4) {
      params.logDiscovery.warn(
        "discovery.wideArea.enabled is true, but no Tailscale IPv4 address was found; skipping unicast DNS-SD zone update",
      );
    } else {
      try {
        const tailnetIPv6 = pickPrimaryTailnetIPv6();
        const result = await writeWideAreaGatewayZone({
          domain: wideAreaDomain,
          gatewayPort: params.port,
          displayName: formatBonjourInstanceName(params.machineDisplayName),
          tailnetIPv4,
          tailnetIPv6: tailnetIPv6 ?? undefined,
          gatewayTlsEnabled: params.gatewayTls?.enabled ?? false,
          gatewayTlsFingerprintSha256: params.gatewayTls?.fingerprintSha256,
          tailnetDns,
          sshPort,
          cliPath: resolveBonjourCliPath(),
        });
        params.logDiscovery.info(
          `wide-area DNS-SD ${result.changed ? "updated" : "unchanged"} (${wideAreaDomain} → ${result.zonePath})`,
        );
      } catch (err) {
        params.logDiscovery.warn(`wide-area discovery update failed: ${String(err)}`);
      }
    }
  }

  return { bonjourStop };
}
