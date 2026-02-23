/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/account-fields.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type TlonAccountFieldsInput = {
  ship?: string;
  url?: string;
  code?: string;
  allowPrivateNetwork?: boolean;
  groupChannels?: string[];
  dmAllowlist?: string[];
  autoDiscoverChannels?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildTlonAccountFields(input: TlonAccountFieldsInput) {
  return {
    ...(input.ship ? { ship: input.ship } : {}),
    ...(input.url ? { url: input.url } : {}),
    ...(input.code ? { code: input.code } : {}),
    ...(typeof input.allowPrivateNetwork === "boolean"
      ? { allowPrivateNetwork: input.allowPrivateNetwork }
      : {}),
    ...(input.groupChannels ? { groupChannels: input.groupChannels } : {}),
    ...(input.dmAllowlist ? { dmAllowlist: input.dmAllowlist } : {}),
    ...(typeof input.autoDiscoverChannels === "boolean"
      ? { autoDiscoverChannels: input.autoDiscoverChannels }
      : {}),
  };
}
