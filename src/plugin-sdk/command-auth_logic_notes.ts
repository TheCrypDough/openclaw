/*
 * AUTO ANNOTATION
 * File: src/plugin-sdk/command-auth.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";

export type ResolveSenderCommandAuthorizationParams = {
  cfg: OpenClawConfig;
  rawBody: string;
  isGroup: boolean;
  dmPolicy: string;
  configuredAllowFrom: string[];
  senderId: string;
  isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
  readAllowFromStore: () => Promise<string[]>;
  shouldComputeCommandAuthorized: (rawBody: string, cfg: OpenClawConfig) => boolean;
  resolveCommandAuthorizedFromAuthorizers: (params: {
    useAccessGroups: boolean;
    authorizers: Array<{ configured: boolean; allowed: boolean }>;
  }) => boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveSenderCommandAuthorization(
  params: ResolveSenderCommandAuthorizationParams,
): Promise<{
  shouldComputeAuth: boolean;
  effectiveAllowFrom: string[];
  senderAllowedForCommands: boolean;
  commandAuthorized: boolean | undefined;
}> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldComputeAuth = params.shouldComputeCommandAuthorized(params.rawBody, params.cfg);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storeAllowFrom =
    !params.isGroup &&
    params.dmPolicy !== "allowlist" &&
    (params.dmPolicy !== "open" || shouldComputeAuth)
      ? await params.readAllowFromStore().catch(() => [])
      : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const effectiveAllowFrom = [...params.configuredAllowFrom, ...storeAllowFrom];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const useAccessGroups = params.cfg.commands?.useAccessGroups !== false;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const senderAllowedForCommands = params.isSenderAllowed(params.senderId, effectiveAllowFrom);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const commandAuthorized = shouldComputeAuth
    ? params.resolveCommandAuthorizedFromAuthorizers({
        useAccessGroups,
        authorizers: [
          { configured: effectiveAllowFrom.length > 0, allowed: senderAllowedForCommands },
        ],
      })
    : undefined;

  return {
    shouldComputeAuth,
    effectiveAllowFrom,
    senderAllowedForCommands,
    commandAuthorized,
  };
}
