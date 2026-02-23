# AUTOPLACEHOLDER_ANNOTATION: src/plugins/config-schema.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import type { OpenClawPluginConfigSchema } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type Issue = { path: Array<string | number>; message: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SafeParseResult =
  | { success: true; data?: unknown }
  | { success: false; error: { issues: Issue[] } };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function error(message: string): SafeParseResult {
  return { success: false, error: { issues: [{ path: [], message }] } };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function emptyPluginConfigSchema(): OpenClawPluginConfigSchema {
  return {
    safeParse(value: unknown): SafeParseResult {
      if (value === undefined) {
        return { success: true, data: undefined };
      }
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return error("expected config object");
      }
      if (Object.keys(value as Record<string, unknown>).length > 0) {
        return error("config must be empty");
      }
      return { success: true, data: value };
    },
    jsonSchema: {
      type: "object",
      additionalProperties: false,
      properties: {},
    },
  };
}
