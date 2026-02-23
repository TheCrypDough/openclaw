/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/token.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MSTeamsConfig } from "openclaw/plugin-sdk";

export type MSTeamsCredentials = {
  appId: string;
  appPassword: string;
  tenantId: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveMSTeamsCredentials(cfg?: MSTeamsConfig): MSTeamsCredentials | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const appId = cfg?.appId?.trim() || process.env.MSTEAMS_APP_ID?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const appPassword = cfg?.appPassword?.trim() || process.env.MSTEAMS_APP_PASSWORD?.trim();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tenantId = cfg?.tenantId?.trim() || process.env.MSTEAMS_TENANT_ID?.trim();

  if (!appId || !appPassword || !tenantId) {
    return undefined;
  }

  return { appId, appPassword, tenantId };
}
