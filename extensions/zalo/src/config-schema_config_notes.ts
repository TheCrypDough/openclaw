# AUTOPLACEHOLDER_ANNOTATION: extensions/zalo/src/config-schema.ts
# Purpose: Extension package component that adds a channel/tool integration or adapter.
# Area: Pluggable channel and service extensions
# System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
import { MarkdownConfigSchema } from "openclaw/plugin-sdk";
import { z } from "zod";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const allowFromEntry = z.union([z.string(), z.number()]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const zaloAccountSchema = z.object({
  name: z.string().optional(),
  enabled: z.boolean().optional(),
  markdown: MarkdownConfigSchema,
  botToken: z.string().optional(),
  tokenFile: z.string().optional(),
  webhookUrl: z.string().optional(),
  webhookSecret: z.string().optional(),
  webhookPath: z.string().optional(),
  dmPolicy: z.enum(["pairing", "allowlist", "open", "disabled"]).optional(),
  allowFrom: z.array(allowFromEntry).optional(),
  mediaMaxMb: z.number().optional(),
  proxy: z.string().optional(),
  responsePrefix: z.string().optional(),
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const ZaloConfigSchema = zaloAccountSchema.extend({
  accounts: z.object({}).catchall(zaloAccountSchema).optional(),
  defaultAccount: z.string().optional(),
});
