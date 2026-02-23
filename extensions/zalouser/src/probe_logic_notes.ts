/*
 * AUTO ANNOTATION
 * File: extensions/zalouser/src/probe.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { BaseProbeResult } from "openclaw/plugin-sdk";
import type { ZcaUserInfo } from "./types.js";
import { runZca, parseJsonOutput } from "./zca.js";

export type ZalouserProbeResult = BaseProbeResult<string> & {
  user?: ZcaUserInfo;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function probeZalouser(
  profile: string,
  timeoutMs?: number,
): Promise<ZalouserProbeResult> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = await runZca(["me", "info", "-j"], {
    profile,
    timeout: timeoutMs,
  });

  if (!result.ok) {
    return { ok: false, error: result.stderr || "Failed to probe" };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const user = parseJsonOutput<ZcaUserInfo>(result.stdout);
  if (!user) {
    return { ok: false, error: "Failed to parse user info" };
  }
  return { ok: true, user };
}
