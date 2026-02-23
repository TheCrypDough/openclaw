/*
 * AUTO ANNOTATION
 * File: src/plugins/services.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createEmptyPluginRegistry } from "./registry.js";
import type { OpenClawPluginService, OpenClawPluginServiceContext } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const mockedLogger = vi.hoisted(() => ({
  info: vi.fn<(msg: string) => void>(),
  warn: vi.fn<(msg: string) => void>(),
  error: vi.fn<(msg: string) => void>(),
  debug: vi.fn<(msg: string) => void>(),
}));

vi.mock("../logging/subsystem.js", () => ({
  createSubsystemLogger: () => mockedLogger,
}));

import { STATE_DIR } from "../config/paths.js";
import { startPluginServices } from "./services.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createRegistry(services: OpenClawPluginService[]) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const registry = createEmptyPluginRegistry();
  for (const service of services) {
    registry.services.push({ pluginId: "plugin:test", service, source: "test" });
  }
  return registry;
}

describe("startPluginServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts services and stops them in reverse order", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const starts: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stops: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const contexts: OpenClawPluginServiceContext[] = [];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const serviceA: OpenClawPluginService = {
      id: "service-a",
      start: (ctx) => {
        starts.push("a");
        contexts.push(ctx);
      },
      stop: () => {
        stops.push("a");
      },
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const serviceB: OpenClawPluginService = {
      id: "service-b",
      start: (ctx) => {
        starts.push("b");
        contexts.push(ctx);
      },
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const serviceC: OpenClawPluginService = {
      id: "service-c",
      start: (ctx) => {
        starts.push("c");
        contexts.push(ctx);
      },
      stop: () => {
        stops.push("c");
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = {} as Parameters<typeof startPluginServices>[0]["config"];
    const handle = await startPluginServices({
      registry: createRegistry([serviceA, serviceB, serviceC]),
      config,
      workspaceDir: "/tmp/workspace",
    });
    await handle.stop();

    expect(starts).toEqual(["a", "b", "c"]);
    expect(stops).toEqual(["c", "a"]);
    expect(contexts).toHaveLength(3);
    for (const ctx of contexts) {
      expect(ctx.config).toBe(config);
      expect(ctx.workspaceDir).toBe("/tmp/workspace");
      expect(ctx.stateDir).toBe(STATE_DIR);
      expect(ctx.logger).toBeDefined();
      expect(typeof ctx.logger.info).toBe("function");
      expect(typeof ctx.logger.warn).toBe("function");
      expect(typeof ctx.logger.error).toBe("function");
    }
  });

  it("logs start/stop failures and continues", async () => {
    const stopOk = vi.fn();
    const stopThrows = vi.fn(() => {
      throw new Error("stop failed");
    });

    const handle = await startPluginServices({
      registry: createRegistry([
        {
          id: "service-start-fail",
          start: () => {
            throw new Error("start failed");
          },
          stop: vi.fn(),
        },
        {
          id: "service-ok",
          start: () => undefined,
          stop: stopOk,
        },
        {
          id: "service-stop-fail",
          start: () => undefined,
          stop: stopThrows,
        },
      ]),
      config: {} as Parameters<typeof startPluginServices>[0]["config"],
    });

    await handle.stop();

    expect(mockedLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("plugin service failed (service-start-fail):"),
    );
    expect(mockedLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining("plugin service stop failed (service-stop-fail):"),
    );
    expect(stopOk).toHaveBeenCalledOnce();
    expect(stopThrows).toHaveBeenCalledOnce();
  });
});
