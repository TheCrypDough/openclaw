/*
 * AUTO ANNOTATION
 * File: src/commands/doctor-platform-notes.launchctl-env-overrides.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { noteMacLaunchctlGatewayEnvOverrides } from "./doctor-platform-notes.js";

describe("noteMacLaunchctlGatewayEnvOverrides", () => {
  it("prints clear unsetenv instructions for token override", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const noteFn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const getenv = vi.fn(async (name: string) =>
      name === "OPENCLAW_GATEWAY_TOKEN" ? "launchctl-token" : undefined,
    );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      gateway: {
        auth: {
          token: "config-token",
        },
      },
    } as OpenClawConfig;

    await noteMacLaunchctlGatewayEnvOverrides(cfg, { platform: "darwin", getenv, noteFn });

    expect(noteFn).toHaveBeenCalledTimes(1);
    expect(getenv).toHaveBeenCalledTimes(4);

    const [message, title] = noteFn.mock.calls[0] ?? [];
    expect(title).toBe("Gateway (macOS)");
    expect(message).toContain("launchctl environment overrides detected");
    expect(message).toContain("OPENCLAW_GATEWAY_TOKEN");
    expect(message).toContain("launchctl unsetenv OPENCLAW_GATEWAY_TOKEN");
    expect(message).not.toContain("OPENCLAW_GATEWAY_PASSWORD");
  });

  it("does nothing when config has no gateway credentials", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const noteFn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const getenv = vi.fn(async () => "launchctl-token");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {} as OpenClawConfig;

    await noteMacLaunchctlGatewayEnvOverrides(cfg, { platform: "darwin", getenv, noteFn });

    expect(getenv).not.toHaveBeenCalled();
    expect(noteFn).not.toHaveBeenCalled();
  });

  it("does nothing on non-darwin platforms", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const noteFn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const getenv = vi.fn(async () => "launchctl-token");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg = {
      gateway: {
        auth: {
          token: "config-token",
        },
      },
    } as OpenClawConfig;

    await noteMacLaunchctlGatewayEnvOverrides(cfg, { platform: "linux", getenv, noteFn });

    expect(getenv).not.toHaveBeenCalled();
    expect(noteFn).not.toHaveBeenCalled();
  });
});
