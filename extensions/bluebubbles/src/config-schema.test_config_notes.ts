# AUTOPLACEHOLDER_ANNOTATION: extensions/bluebubbles/src/config-schema.test.ts
# Purpose: Extension package component that adds a channel/tool integration or adapter.
# Area: Pluggable channel and service extensions
# System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
import { describe, expect, it } from "vitest";
import { BlueBubblesConfigSchema } from "./config-schema.js";

describe("BlueBubblesConfigSchema", () => {
  it("accepts account config when serverUrl and password are both set", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = BlueBubblesConfigSchema.safeParse({
      serverUrl: "http://localhost:1234",
      password: "secret",
    });
    expect(parsed.success).toBe(true);
  });

  it("requires password when top-level serverUrl is configured", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = BlueBubblesConfigSchema.safeParse({
      serverUrl: "http://localhost:1234",
    });
    expect(parsed.success).toBe(false);
    if (parsed.success) {
      return;
    }
    expect(parsed.error.issues[0]?.path).toEqual(["password"]);
    expect(parsed.error.issues[0]?.message).toBe(
      "password is required when serverUrl is configured",
    );
  });

  it("requires password when account serverUrl is configured", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = BlueBubblesConfigSchema.safeParse({
      accounts: {
        work: {
          serverUrl: "http://localhost:1234",
        },
      },
    });
    expect(parsed.success).toBe(false);
    if (parsed.success) {
      return;
    }
    expect(parsed.error.issues[0]?.path).toEqual(["accounts", "work", "password"]);
    expect(parsed.error.issues[0]?.message).toBe(
      "password is required when serverUrl is configured",
    );
  });

  it("allows password omission when serverUrl is not configured", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = BlueBubblesConfigSchema.safeParse({
      accounts: {
        work: {
          name: "Work iMessage",
        },
      },
    });
    expect(parsed.success).toBe(true);
  });
});
