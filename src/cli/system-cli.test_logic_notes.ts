/*
 * AUTO ANNOTATION
 * File: src/cli/system-cli.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Command } from "commander";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCliRuntimeCapture } from "./test-runtime-capture.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const callGatewayFromCli = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const addGatewayClientOptions = vi.fn((command: Command) => command);

const { runtimeLogs, runtimeErrors, defaultRuntime, resetRuntimeCapture } =
  createCliRuntimeCapture();

vi.mock("./gateway-rpc.js", () => ({
  addGatewayClientOptions,
  callGatewayFromCli,
}));

vi.mock("../runtime.js", () => ({
  defaultRuntime,
}));

const { registerSystemCli } = await import("./system-cli.js");

describe("system-cli", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function runCli(args: string[]) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const program = new Command();
    registerSystemCli(program);
    try {
      await program.parseAsync(args, { from: "user" });
    } catch (err) {
      if (!(err instanceof Error && err.message.startsWith("__exit__:"))) {
        throw err;
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks();
    resetRuntimeCapture();
    callGatewayFromCli.mockResolvedValue({ ok: true });
  });

  it("runs system event with default wake mode and text output", async () => {
    await runCli(["system", "event", "--text", "  hello world  "]);

    expect(callGatewayFromCli).toHaveBeenCalledWith(
      "wake",
      expect.objectContaining({ text: "  hello world  " }),
      { mode: "next-heartbeat", text: "hello world" },
      { expectFinal: false },
    );
    expect(runtimeLogs).toEqual(["ok"]);
  });

  it("prints JSON for event when --json is enabled", async () => {
    callGatewayFromCli.mockResolvedValueOnce({ id: "wake-1" });

    await runCli(["system", "event", "--text", "hello", "--json"]);

    expect(runtimeLogs).toEqual([JSON.stringify({ id: "wake-1" }, null, 2)]);
  });

  it("handles invalid wake mode as runtime error", async () => {
    await runCli(["system", "event", "--text", "hello", "--mode", "later"]);

    expect(callGatewayFromCli).not.toHaveBeenCalled();
    expect(runtimeErrors[0]).toContain("--mode must be now or next-heartbeat");
  });

  it.each([
    { args: ["system", "heartbeat", "last"], method: "last-heartbeat", params: undefined },
    {
      args: ["system", "heartbeat", "enable"],
      method: "set-heartbeats",
      params: { enabled: true },
    },
    {
      args: ["system", "heartbeat", "disable"],
      method: "set-heartbeats",
      params: { enabled: false },
    },
    { args: ["system", "presence"], method: "system-presence", params: undefined },
  ])("routes $args to gateway", async ({ args, method, params }) => {
    callGatewayFromCli.mockResolvedValueOnce({ method });

    await runCli(args);

    expect(callGatewayFromCli).toHaveBeenCalledWith(method, expect.any(Object), params, {
      expectFinal: false,
    });
    expect(runtimeLogs).toEqual([JSON.stringify({ method }, null, 2)]);
  });
});
