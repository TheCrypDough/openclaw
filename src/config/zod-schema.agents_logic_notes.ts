/*
 * AUTO ANNOTATION
 * File: src/config/zod-schema.agents.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { z } from "zod";
import { AgentDefaultsSchema } from "./zod-schema.agent-defaults.js";
import { AgentEntrySchema } from "./zod-schema.agent-runtime.js";
import { TranscribeAudioSchema } from "./zod-schema.core.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const AgentsSchema = z
  .object({
    defaults: z.lazy(() => AgentDefaultsSchema).optional(),
    list: z.array(AgentEntrySchema).optional(),
  })
  .strict()
  .optional();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BindingsSchema = z
  .array(
    z
      .object({
        agentId: z.string(),
        match: z
          .object({
            channel: z.string(),
            accountId: z.string().optional(),
            peer: z
              .object({
                kind: z.union([
                  z.literal("direct"),
                  z.literal("group"),
                  z.literal("channel"),
                  /** @deprecated Use `direct` instead. Kept for backward compatibility. */
                  z.literal("dm"),
                ]),
                id: z.string(),
              })
              .strict()
              .optional(),
            guildId: z.string().optional(),
            teamId: z.string().optional(),
            roles: z.array(z.string()).optional(),
          })
          .strict(),
      })
      .strict(),
  )
  .optional();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BroadcastStrategySchema = z.enum(["parallel", "sequential"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const BroadcastSchema = z
  .object({
    strategy: BroadcastStrategySchema.optional(),
  })
  .catchall(z.array(z.string()))
  .optional();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const AudioSchema = z
  .object({
    transcription: TranscribeAudioSchema,
  })
  .strict()
  .optional();
