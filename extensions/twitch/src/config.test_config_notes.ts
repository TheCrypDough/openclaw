# AUTOPLACEHOLDER_ANNOTATION: extensions/twitch/src/config.test.ts
# Purpose: Extension package component that adds a channel/tool integration or adapter.
# Area: Pluggable channel and service extensions
# System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
import { describe, expect, it } from "vitest";
import { getAccountConfig } from "./config.js";

describe("getAccountConfig", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mockMultiAccountConfig = {
    channels: {
      twitch: {
        accounts: {
          default: {
            username: "testbot",
            accessToken: "oauth:test123",
          },
          secondary: {
            username: "secondbot",
            accessToken: "oauth:secondary",
          },
        },
      },
    },
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mockSimplifiedConfig = {
    channels: {
      twitch: {
        username: "testbot",
        accessToken: "oauth:test123",
      },
    },
  };

  it("returns account config for valid account ID (multi-account)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = getAccountConfig(mockMultiAccountConfig, "default");

    expect(result).not.toBeNull();
    expect(result?.username).toBe("testbot");
  });

  it("returns account config for default account (simplified config)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = getAccountConfig(mockSimplifiedConfig, "default");

    expect(result).not.toBeNull();
    expect(result?.username).toBe("testbot");
  });

  it("returns non-default account from multi-account config", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = getAccountConfig(mockMultiAccountConfig, "secondary");

    expect(result).not.toBeNull();
    expect(result?.username).toBe("secondbot");
  });

  it("returns null for non-existent account ID", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = getAccountConfig(mockMultiAccountConfig, "nonexistent");

    expect(result).toBeNull();
  });

  it("returns null when core config is null", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = getAccountConfig(null, "default");

    expect(result).toBeNull();
  });

  it("returns null when core config is undefined", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = getAccountConfig(undefined, "default");

    expect(result).toBeNull();
  });

  it("returns null when channels are not defined", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = getAccountConfig({}, "default");

    expect(result).toBeNull();
  });

  it("returns null when twitch is not defined", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = getAccountConfig({ channels: {} }, "default");

    expect(result).toBeNull();
  });

  it("returns null when accounts are not defined", () => {
    const result = getAccountConfig({ channels: { twitch: {} } }, "default");

    expect(result).toBeNull();
  });
});
