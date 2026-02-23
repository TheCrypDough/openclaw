# AUTOPLACEHOLDER_ANNOTATION: extensions/feishu/src/config-schema.test.ts
# Purpose: Extension package component that adds a channel/tool integration or adapter.
# Area: Pluggable channel and service extensions
# System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
import { describe, expect, it } from "vitest";
import { FeishuConfigSchema } from "./config-schema.js";

describe("FeishuConfigSchema webhook validation", () => {
  it("rejects top-level webhook mode without verificationToken", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = FeishuConfigSchema.safeParse({
      connectionMode: "webhook",
      appId: "cli_top",
      appSecret: "secret_top",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path.join(".") === "verificationToken"),
      ).toBe(true);
    }
  });

  it("accepts top-level webhook mode with verificationToken", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = FeishuConfigSchema.safeParse({
      connectionMode: "webhook",
      verificationToken: "token_top",
      appId: "cli_top",
      appSecret: "secret_top",
    });

    expect(result.success).toBe(true);
  });

  it("rejects account webhook mode without verificationToken", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = FeishuConfigSchema.safeParse({
      accounts: {
        main: {
          connectionMode: "webhook",
          appId: "cli_main",
          appSecret: "secret_main",
        },
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.path.join(".") === "accounts.main.verificationToken",
        ),
      ).toBe(true);
    }
  });

  it("accepts account webhook mode inheriting top-level verificationToken", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = FeishuConfigSchema.safeParse({
      verificationToken: "token_top",
      accounts: {
        main: {
          connectionMode: "webhook",
          appId: "cli_main",
          appSecret: "secret_main",
        },
      },
    });

    expect(result.success).toBe(true);
  });
});
