/*
 * AUTO ANNOTATION
 * File: src/plugins/wired-hooks-gateway.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Test: gateway_start & gateway_stop hook wiring (server.impl.ts)
 *
 * Since startGatewayServer is heavily integrated, we test the hook runner
 * calls at the unit level by verifying the hook runner functions exist
 * and validating the integration pattern.
 */
import { describe, expect, it, vi } from "vitest";
import { createHookRunner } from "./hooks.js";
import { createMockPluginRegistry } from "./hooks.test-helpers.js";

describe("gateway hook runner methods", () => {
  it("runGatewayStart invokes registered gateway_start hooks", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createMockPluginRegistry([{ hookName: "gateway_start", handler }]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runner = createHookRunner(registry);

    await runner.runGatewayStart({ port: 18789 }, { port: 18789 });

    expect(handler).toHaveBeenCalledWith({ port: 18789 }, { port: 18789 });
  });

  it("runGatewayStop invokes registered gateway_stop hooks", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const handler = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createMockPluginRegistry([{ hookName: "gateway_stop", handler }]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runner = createHookRunner(registry);

    await runner.runGatewayStop({ reason: "test shutdown" }, { port: 18789 });

    expect(handler).toHaveBeenCalledWith({ reason: "test shutdown" }, { port: 18789 });
  });

  it("hasHooks returns true for registered gateway hooks", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const registry = createMockPluginRegistry([{ hookName: "gateway_start", handler: vi.fn() }]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const runner = createHookRunner(registry);

    expect(runner.hasHooks("gateway_start")).toBe(true);
    expect(runner.hasHooks("gateway_stop")).toBe(false);
  });
});
