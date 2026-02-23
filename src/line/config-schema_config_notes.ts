# AUTOPLACEHOLDER_ANNOTATION: src/line/config-schema.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { z } from "zod";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DmPolicySchema = z.enum(["open", "allowlist", "pairing", "disabled"]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const GroupPolicySchema = z.enum(["open", "allowlist", "disabled"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const LineCommonConfigSchema = z.object({
  enabled: z.boolean().optional(),
  channelAccessToken: z.string().optional(),
  channelSecret: z.string().optional(),
  tokenFile: z.string().optional(),
  secretFile: z.string().optional(),
  name: z.string().optional(),
  allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
  groupAllowFrom: z.array(z.union([z.string(), z.number()])).optional(),
  dmPolicy: DmPolicySchema.optional().default("pairing"),
  groupPolicy: GroupPolicySchema.optional().default("allowlist"),
  responsePrefix: z.string().optional(),
  mediaMaxMb: z.number().optional(),
  webhookPath: z.string().optional(),
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const LineGroupConfigSchema = z
  .object({
    enabled: z.boolean().optional(),
    allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
    requireMention: z.boolean().optional(),
    systemPrompt: z.string().optional(),
    skills: z.array(z.string()).optional(),
  })
  .strict();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const LineAccountConfigSchema = LineCommonConfigSchema.extend({
  groups: z.record(z.string(), LineGroupConfigSchema.optional()).optional(),
}).strict();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const LineConfigSchema = LineCommonConfigSchema.extend({
  accounts: z.record(z.string(), LineAccountConfigSchema.optional()).optional(),
  groups: z.record(z.string(), LineGroupConfigSchema.optional()).optional(),
}).strict();

export type LineConfigSchemaType = z.infer<typeof LineConfigSchema>;
