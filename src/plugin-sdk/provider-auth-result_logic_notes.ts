/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/provider-auth-result.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { AuthProfileCredential } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/config.js";
import type { ProviderAuthResult } from "../plugins/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildOauthProviderAuthResult(params: {
  providerId: string;
  defaultModel: string;
  access: string;
  refresh?: string | null;
  expires?: number | null;
  email?: string | null;
  profilePrefix?: string;
  credentialExtra?: Record<string, unknown>;
  configPatch?: Partial<OpenClawConfig>;
  notes?: string[];
}): ProviderAuthResult {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const email = params.email ?? undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const profilePrefix = params.profilePrefix ?? params.providerId;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const profileId = `${profilePrefix}:${email ?? "default"}`;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const credential: AuthProfileCredential = {
    type: "oauth",
    provider: params.providerId,
    access: params.access,
    ...(params.refresh ? { refresh: params.refresh } : {}),
    ...(Number.isFinite(params.expires) ? { expires: params.expires as number } : {}),
    ...(email ? { email } : {}),
    ...params.credentialExtra,
  } as AuthProfileCredential;

  return {
    profiles: [{ profileId, credential }],
    configPatch:
      params.configPatch ??
      ({
        agents: {
          defaults: {
            models: {
              [params.defaultModel]: {},
            },
          },
        },
      } as Partial<OpenClawConfig>),
    defaultModel: params.defaultModel,
    notes: params.notes,
  };
}
