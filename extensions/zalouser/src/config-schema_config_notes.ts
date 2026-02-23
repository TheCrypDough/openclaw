# AUTOPLACEHOLDER_ANNOTATION: extensions/zalouser/src/config-schema.ts
# Purpose: Extension package component that adds a channel/tool integration or adapter.
# Area: Pluggable channel and service extensions
# System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
import { MarkdownConfigSchema, ToolPolicySchema } from "openclaw/plugin-sdk";
import { z } from "zod";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const allowFromEntry = z.union([z.string(), z.number()]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const groupConfigSchema = z.object({
  allow: z.boolean().optional(),
  enabled: z.boolean().optional(),
  tools: ToolPolicySchema,
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const zalouserAccountSchema = z.object({
  name: z.string().optional(),
  enabled: z.boolean().optional(),
  markdown: MarkdownConfigSchema,
  profile: z.string().optional(),
  dmPolicy: z.enum(["pairing", "allowlist", "open", "disabled"]).optional(),
  allowFrom: z.array(allowFromEntry).optional(),
  groupPolicy: z.enum(["disabled", "allowlist", "open"]).optional(),
  groups: z.object({}).catchall(groupConfigSchema).optional(),
  messagePrefix: z.string().optional(),
  responsePrefix: z.string().optional(),
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const ZalouserConfigSchema = zalouserAccountSchema.extend({
  accounts: z.object({}).catchall(zalouserAccountSchema).optional(),
  defaultAccount: z.string().optional(),
});
