# AUTOPLACEHOLDER_ANNOTATION: extensions/irc/src/config-schema.test.ts
# Purpose: Extension package component that adds a channel/tool integration or adapter.
# Area: Pluggable channel and service extensions
# System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
import { describe, expect, it } from "vitest";
import { IrcConfigSchema } from "./config-schema.js";

describe("irc config schema", () => {
  it("accepts numeric allowFrom and groupAllowFrom entries", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = IrcConfigSchema.parse({
      dmPolicy: "allowlist",
      allowFrom: [12345, "alice"],
      groupAllowFrom: [67890, "alice!ident@example.org"],
    });

    expect(parsed.allowFrom).toEqual([12345, "alice"]);
    expect(parsed.groupAllowFrom).toEqual([67890, "alice!ident@example.org"]);
  });

  it("accepts numeric per-channel allowFrom entries", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = IrcConfigSchema.parse({
      groups: {
        "#ops": {
          allowFrom: [42, "alice"],
        },
      },
    });

    expect(parsed.groups?.["#ops"]?.allowFrom).toEqual([42, "alice"]);
  });
});
