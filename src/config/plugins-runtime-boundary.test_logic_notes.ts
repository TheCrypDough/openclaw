/*
 * AUTO ANNOTATION
 * File: src/config/plugins-runtime-boundary.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { FIELD_HELP } from "./schema.help.js";
import { FIELD_LABELS } from "./schema.labels.js";
import { OpenClawSchema } from "./zod-schema.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function hasLegacyPluginsRuntimeKeys(keys: string[]): boolean {
  return keys.some((key) => key === "plugins.runtime" || key.startsWith("plugins.runtime."));
}

describe("plugins runtime boundary config", () => {
  it("omits legacy plugins.runtime keys from schema metadata", () => {
    expect(hasLegacyPluginsRuntimeKeys(Object.keys(FIELD_HELP))).toBe(false);
    expect(hasLegacyPluginsRuntimeKeys(Object.keys(FIELD_LABELS))).toBe(false);
  });

  it("omits plugins.runtime from the generated config schema", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const schema = OpenClawSchema.toJSONSchema({
      target: "draft-7",
      io: "input",
      reused: "ref",
    }) as {
      properties?: Record<string, { properties?: Record<string, unknown> }>;
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const pluginsProperties = schema.properties?.plugins?.properties ?? {};
    expect("runtime" in pluginsProperties).toBe(false);
  });

  it("rejects legacy plugins.runtime config entries", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = OpenClawSchema.safeParse({
      plugins: {
        runtime: {
          allowLegacyExec: true,
        },
      },
    });
    expect(result.success).toBe(false);
  });
});
