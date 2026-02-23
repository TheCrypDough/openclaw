/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/account-action-gate.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type ActionGate<T extends Record<string, boolean | undefined>> = (
  key: keyof T,
  defaultValue?: boolean,
) => boolean;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createAccountActionGate<T extends Record<string, boolean | undefined>>(params: {
  baseActions?: T;
  accountActions?: T;
}): ActionGate<T> {
  return (key, defaultValue = true) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const accountValue = params.accountActions?.[key];
    if (accountValue !== undefined) {
      return accountValue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const baseValue = params.baseActions?.[key];
    if (baseValue !== undefined) {
      return baseValue;
    }
    return defaultValue;
  };
}
