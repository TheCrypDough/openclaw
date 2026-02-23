/*
 * AUTO ANNOTATION
 * File: src/config/zod-schema.approvals.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { z } from "zod";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ExecApprovalForwardTargetSchema = z
  .object({
    channel: z.string().min(1),
    to: z.string().min(1),
    accountId: z.string().optional(),
    threadId: z.union([z.string(), z.number()]).optional(),
  })
  .strict();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ExecApprovalForwardingSchema = z
  .object({
    enabled: z.boolean().optional(),
    mode: z.union([z.literal("session"), z.literal("targets"), z.literal("both")]).optional(),
    agentFilter: z.array(z.string()).optional(),
    sessionFilter: z.array(z.string()).optional(),
    targets: z.array(ExecApprovalForwardTargetSchema).optional(),
  })
  .strict()
  .optional();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const ApprovalsSchema = z
  .object({
    exec: ExecApprovalForwardingSchema,
  })
  .strict()
  .optional();
