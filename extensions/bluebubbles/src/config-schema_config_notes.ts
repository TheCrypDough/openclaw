# AUTOPLACEHOLDER_ANNOTATION: extensions/bluebubbles/src/config-schema.ts
# Purpose: Extension package component that adds a channel/tool integration or adapter.
# Area: Pluggable channel and service extensions
# System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
import { MarkdownConfigSchema, ToolPolicySchema } from "openclaw/plugin-sdk";
import { z } from "zod";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const allowFromEntry = z.union([z.string(), z.number()]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const bluebubblesActionSchema = z
  .object({
    reactions: z.boolean().default(true),
    edit: z.boolean().default(true),
    unsend: z.boolean().default(true),
    reply: z.boolean().default(true),
    sendWithEffect: z.boolean().default(true),
    renameGroup: z.boolean().default(true),
    setGroupIcon: z.boolean().default(true),
    addParticipant: z.boolean().default(true),
    removeParticipant: z.boolean().default(true),
    leaveGroup: z.boolean().default(true),
    sendAttachment: z.boolean().default(true),
  })
  .optional();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const bluebubblesGroupConfigSchema = z.object({
  requireMention: z.boolean().optional(),
  tools: ToolPolicySchema,
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const bluebubblesAccountSchema = z
  .object({
    name: z.string().optional(),
    enabled: z.boolean().optional(),
    markdown: MarkdownConfigSchema,
    serverUrl: z.string().optional(),
    password: z.string().optional(),
    webhookPath: z.string().optional(),
    dmPolicy: z.enum(["pairing", "allowlist", "open", "disabled"]).optional(),
    allowFrom: z.array(allowFromEntry).optional(),
    groupAllowFrom: z.array(allowFromEntry).optional(),
    groupPolicy: z.enum(["open", "disabled", "allowlist"]).optional(),
    historyLimit: z.number().int().min(0).optional(),
    dmHistoryLimit: z.number().int().min(0).optional(),
    textChunkLimit: z.number().int().positive().optional(),
    chunkMode: z.enum(["length", "newline"]).optional(),
    mediaMaxMb: z.number().int().positive().optional(),
    mediaLocalRoots: z.array(z.string()).optional(),
    sendReadReceipts: z.boolean().optional(),
    blockStreaming: z.boolean().optional(),
    groups: z.object({}).catchall(bluebubblesGroupConfigSchema).optional(),
  })
  .superRefine((value, ctx) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const serverUrl = value.serverUrl?.trim() ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const password = value.password?.trim() ?? "";
    if (serverUrl && !password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "password is required when serverUrl is configured",
      });
    }
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BlueBubblesConfigSchema = bluebubblesAccountSchema.extend({
  accounts: z.object({}).catchall(bluebubblesAccountSchema).optional(),
  actions: bluebubblesActionSchema,
});
