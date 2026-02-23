# AUTOPLACEHOLDER_ANNOTATION: src/channels/plugins/config-schema.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import type { ZodTypeAny } from "zod";
import type { ChannelConfigSchema } from "./types.plugin.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildChannelConfigSchema(schema: ZodTypeAny): ChannelConfigSchema {
  return {
    schema: schema.toJSONSchema({
      target: "draft-07",
      unrepresentable: "any",
    }) as Record<string, unknown>,
  };
}
