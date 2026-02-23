# AUTOPLACEHOLDER_ANNOTATION: extensions/tlon/src/config-schema.test.ts
# Purpose: Extension package component that adds a channel/tool integration or adapter.
# Area: Pluggable channel and service extensions
# System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
import { describe, expect, it } from "vitest";
import { TlonAuthorizationSchema, TlonConfigSchema } from "./config-schema.js";

describe("Tlon config schema", () => {
  it("accepts channelRules with string keys", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = TlonAuthorizationSchema.parse({
      channelRules: {
        "chat/~zod/test": {
          mode: "open",
          allowedShips: ["~zod"],
        },
      },
    });

    expect(parsed.channelRules?.["chat/~zod/test"]?.mode).toBe("open");
  });

  it("accepts accounts with string keys", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = TlonConfigSchema.parse({
      accounts: {
        primary: {
          ship: "~zod",
          url: "https://example.com",
          code: "code-123",
        },
      },
    });

    expect(parsed.accounts?.primary?.ship).toBe("~zod");
  });
});
