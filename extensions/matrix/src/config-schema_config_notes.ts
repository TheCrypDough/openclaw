# AUTOPLACEHOLDER_ANNOTATION: extensions/matrix/src/config-schema.ts
# Purpose: Extension package component that adds a channel/tool integration or adapter.
# Area: Pluggable channel and service extensions
# System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
import { MarkdownConfigSchema, ToolPolicySchema } from "openclaw/plugin-sdk";
import { z } from "zod";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const allowFromEntry = z.union([z.string(), z.number()]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const matrixActionSchema = z
  .object({
    reactions: z.boolean().optional(),
    messages: z.boolean().optional(),
    pins: z.boolean().optional(),
    memberInfo: z.boolean().optional(),
    channelInfo: z.boolean().optional(),
  })
  .optional();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const matrixDmSchema = z
  .object({
    enabled: z.boolean().optional(),
    policy: z.enum(["pairing", "allowlist", "open", "disabled"]).optional(),
    allowFrom: z.array(allowFromEntry).optional(),
  })
  .optional();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const matrixRoomSchema = z
  .object({
    enabled: z.boolean().optional(),
    allow: z.boolean().optional(),
    requireMention: z.boolean().optional(),
    tools: ToolPolicySchema,
    autoReply: z.boolean().optional(),
    users: z.array(allowFromEntry).optional(),
    skills: z.array(z.string()).optional(),
    systemPrompt: z.string().optional(),
  })
  .optional();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const MatrixConfigSchema = z.object({
  name: z.string().optional(),
  enabled: z.boolean().optional(),
  markdown: MarkdownConfigSchema,
  homeserver: z.string().optional(),
  userId: z.string().optional(),
  accessToken: z.string().optional(),
  password: z.string().optional(),
  deviceName: z.string().optional(),
  initialSyncLimit: z.number().optional(),
  encryption: z.boolean().optional(),
  allowlistOnly: z.boolean().optional(),
  groupPolicy: z.enum(["open", "disabled", "allowlist"]).optional(),
  replyToMode: z.enum(["off", "first", "all"]).optional(),
  threadReplies: z.enum(["off", "inbound", "always"]).optional(),
  textChunkLimit: z.number().optional(),
  chunkMode: z.enum(["length", "newline"]).optional(),
  responsePrefix: z.string().optional(),
  mediaMaxMb: z.number().optional(),
  autoJoin: z.enum(["always", "allowlist", "off"]).optional(),
  autoJoinAllowlist: z.array(allowFromEntry).optional(),
  groupAllowFrom: z.array(allowFromEntry).optional(),
  dm: matrixDmSchema,
  groups: z.object({}).catchall(matrixRoomSchema).optional(),
  rooms: z.object({}).catchall(matrixRoomSchema).optional(),
  actions: matrixActionSchema,
});
