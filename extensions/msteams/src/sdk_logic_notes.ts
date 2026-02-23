/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/sdk.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MSTeamsAdapter } from "./messenger.js";
import type { MSTeamsCredentials } from "./token.js";

export type MSTeamsSdk = typeof import("@microsoft/agents-hosting");
export type MSTeamsAuthConfig = ReturnType<MSTeamsSdk["getAuthConfigWithDefaults"]>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function loadMSTeamsSdk(): Promise<MSTeamsSdk> {
  return await import("@microsoft/agents-hosting");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildMSTeamsAuthConfig(
  creds: MSTeamsCredentials,
  sdk: MSTeamsSdk,
): MSTeamsAuthConfig {
  return sdk.getAuthConfigWithDefaults({
    clientId: creds.appId,
    clientSecret: creds.appPassword,
    tenantId: creds.tenantId,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createMSTeamsAdapter(
  authConfig: MSTeamsAuthConfig,
  sdk: MSTeamsSdk,
): MSTeamsAdapter {
  return new sdk.CloudAdapter(authConfig) as unknown as MSTeamsAdapter;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function loadMSTeamsSdkWithAuth(creds: MSTeamsCredentials) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sdk = await loadMSTeamsSdk();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const authConfig = buildMSTeamsAuthConfig(creds, sdk);
  return { sdk, authConfig };
}
