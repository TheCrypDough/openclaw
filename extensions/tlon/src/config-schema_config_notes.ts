# AUTOPLACEHOLDER_ANNOTATION: extensions/tlon/src/config-schema.ts
# Purpose: Extension package component that adds a channel/tool integration or adapter.
# Area: Pluggable channel and service extensions
# System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
import { buildChannelConfigSchema } from "openclaw/plugin-sdk";
import { z } from "zod";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ShipSchema = z.string().min(1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ChannelNestSchema = z.string().min(1);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const TlonChannelRuleSchema = z.object({
  mode: z.enum(["restricted", "open"]).optional(),
  allowedShips: z.array(ShipSchema).optional(),
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const TlonAuthorizationSchema = z.object({
  channelRules: z.record(z.string(), TlonChannelRuleSchema).optional(),
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const TlonAccountSchema = z.object({
  name: z.string().optional(),
  enabled: z.boolean().optional(),
  ship: ShipSchema.optional(),
  url: z.string().optional(),
  code: z.string().optional(),
  allowPrivateNetwork: z.boolean().optional(),
  groupChannels: z.array(ChannelNestSchema).optional(),
  dmAllowlist: z.array(ShipSchema).optional(),
  autoDiscoverChannels: z.boolean().optional(),
  showModelSignature: z.boolean().optional(),
  responsePrefix: z.string().optional(),
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const TlonConfigSchema = z.object({
  name: z.string().optional(),
  enabled: z.boolean().optional(),
  ship: ShipSchema.optional(),
  url: z.string().optional(),
  code: z.string().optional(),
  allowPrivateNetwork: z.boolean().optional(),
  groupChannels: z.array(ChannelNestSchema).optional(),
  dmAllowlist: z.array(ShipSchema).optional(),
  autoDiscoverChannels: z.boolean().optional(),
  showModelSignature: z.boolean().optional(),
  responsePrefix: z.string().optional(),
  authorization: TlonAuthorizationSchema.optional(),
  defaultAuthorizedShips: z.array(ShipSchema).optional(),
  accounts: z.record(z.string(), TlonAccountSchema).optional(),
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const tlonChannelConfigSchema = buildChannelConfigSchema(TlonConfigSchema);
