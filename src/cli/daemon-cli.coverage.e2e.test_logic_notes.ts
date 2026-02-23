/*
 * AUTO ANNOTATION
 * File: src/cli/daemon-cli.coverage.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Command } from "commander";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { captureEnv } from "../test-utils/env.js";
import { createCliRuntimeCapture } from "./test-runtime-capture.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const callGateway = vi.fn(async (..._args: unknown[]) => ({ ok: true }));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const resolveGatewayProgramArguments = vi.fn(async (_opts?: unknown) => ({
  programArguments: ["/bin/node", "cli", "gateway", "--port", "18789"],
}));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const serviceInstall = vi.fn().mockResolvedValue(undefined);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const serviceUninstall = vi.fn().mockResolvedValue(undefined);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const serviceStop = vi.fn().mockResolvedValue(undefined);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const serviceRestart = vi.fn().mockResolvedValue(undefined);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const serviceIsLoaded = vi.fn().mockResolvedValue(false);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const serviceReadCommand = vi.fn().mockResolvedValue(null);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const serviceReadRuntime = vi.fn().mockResolvedValue({ status: "running" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const findExtraGatewayServices = vi.fn(async (_env: unknown, _opts?: unknown) => []);
const inspectPortUsage = vi.fn(async (port: number) => ({
  port,
  status: "free",
  listeners: [],
  hints: [],
}));

const { runtimeLogs, defaultRuntime, resetRuntimeCapture } = createCliRuntimeCapture();

vi.mock("../gateway/call.js", () => ({
  callGateway: (opts: unknown) => callGateway(opts),
}));

vi.mock("../daemon/program-args.js", () => ({
  resolveGatewayProgramArguments: (opts: unknown) => resolveGatewayProgramArguments(opts),
}));

vi.mock("../daemon/service.js", () => ({
  resolveGatewayService: () => ({
    label: "LaunchAgent",
    loadedText: "loaded",
    notLoadedText: "not loaded",
    install: serviceInstall,
    uninstall: serviceUninstall,
    stop: serviceStop,
    restart: serviceRestart,
    isLoaded: serviceIsLoaded,
    readCommand: serviceReadCommand,
    readRuntime: serviceReadRuntime,
  }),
}));

vi.mock("../daemon/legacy.js", () => ({
  findLegacyGatewayServices: async () => [],
}));

vi.mock("../daemon/inspect.js", () => ({
  findExtraGatewayServices: (env: unknown, opts?: unknown) => findExtraGatewayServices(env, opts),
  renderGatewayServiceCleanupHints: () => [],
}));

vi.mock("../infra/ports.js", () => ({
  inspectPortUsage: (port: number) => inspectPortUsage(port),
  formatPortDiagnostics: () => ["Port 18789 is already in use."],
}));

vi.mock("../runtime.js", () => ({
  defaultRuntime,
}));

vi.mock("./deps.js", () => ({
  createDefaultDeps: () => {},
}));

vi.mock("./progress.js", () => ({
  withProgress: async (_opts: unknown, fn: () => Promise<unknown>) => await fn(),
}));

const { registerDaemonCli } = await import("./daemon-cli.js");

function createDaemonProgram() {
  const program = new Command();
  program.exitOverride();
  registerDaemonCli(program);
  return program;
}

async function runDaemonCommand(args: string[]) {
  const program = createDaemonProgram();
  await program.parseAsync(args, { from: "user" });
}

function parseFirstJsonRuntimeLine<T>() {
  const jsonLine = runtimeLogs.find((line) => line.trim().startsWith("{"));
  return JSON.parse(jsonLine ?? "{}") as T;
}

describe("daemon-cli coverage", () => {
  let envSnapshot: ReturnType<typeof captureEnv>;

  beforeEach(() => {
    envSnapshot = captureEnv([
      "OPENCLAW_STATE_DIR",
      "OPENCLAW_CONFIG_PATH",
      "OPENCLAW_GATEWAY_PORT",
      "OPENCLAW_PROFILE",
    ]);
    process.env.OPENCLAW_STATE_DIR = "/tmp/openclaw-cli-state";
    process.env.OPENCLAW_CONFIG_PATH = "/tmp/openclaw-cli-state/openclaw.json";
    delete process.env.OPENCLAW_GATEWAY_PORT;
    delete process.env.OPENCLAW_PROFILE;
    serviceReadCommand.mockResolvedValue(null);
  });

  afterEach(() => {
    envSnapshot.restore();
  });

  it("probes gateway status by default", async () => {
    resetRuntimeCapture();
    callGateway.mockClear();

    await runDaemonCommand(["daemon", "status"]);

    expect(callGateway).toHaveBeenCalledTimes(1);
    expect(callGateway).toHaveBeenCalledWith(expect.objectContaining({ method: "status" }));
    expect(findExtraGatewayServices).toHaveBeenCalled();
    expect(inspectPortUsage).toHaveBeenCalled();
  }, 20_000);

  it("derives probe URL from service args + env (json)", async () => {
    resetRuntimeCapture();
    callGateway.mockClear();
    inspectPortUsage.mockClear();

    serviceReadCommand.mockResolvedValueOnce({
      programArguments: ["/bin/node", "cli", "gateway", "--port", "19001"],
      environment: {
        OPENCLAW_PROFILE: "dev",
        OPENCLAW_STATE_DIR: "/tmp/openclaw-daemon-state",
        OPENCLAW_CONFIG_PATH: "/tmp/openclaw-daemon-state/openclaw.json",
        OPENCLAW_GATEWAY_PORT: "19001",
      },
      sourcePath: "/tmp/bot.molt.gateway.plist",
    });

    await runDaemonCommand(["daemon", "status", "--json"]);

    expect(callGateway).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "ws://127.0.0.1:19001",
        method: "status",
      }),
    );
    expect(inspectPortUsage).toHaveBeenCalledWith(19001);

    const parsed = parseFirstJsonRuntimeLine<{
      gateway?: { port?: number; portSource?: string; probeUrl?: string };
      config?: { mismatch?: boolean };
      rpc?: { url?: string; ok?: boolean };
    }>();
    expect(parsed.gateway?.port).toBe(19001);
    expect(parsed.gateway?.portSource).toBe("service args");
    expect(parsed.gateway?.probeUrl).toBe("ws://127.0.0.1:19001");
    expect(parsed.config?.mismatch).toBe(true);
    expect(parsed.rpc?.url).toBe("ws://127.0.0.1:19001");
    expect(parsed.rpc?.ok).toBe(true);
  }, 20_000);

  it("passes deep scan flag for daemon status", async () => {
    findExtraGatewayServices.mockClear();

    await runDaemonCommand(["daemon", "status", "--deep"]);

    expect(findExtraGatewayServices).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ deep: true }),
    );
  });

  it.each([
    { label: "plain output", includeJsonFlag: false },
    { label: "json output", includeJsonFlag: true },
  ])("installs the daemon ($label)", async ({ includeJsonFlag }) => {
    resetRuntimeCapture();
    serviceIsLoaded.mockResolvedValueOnce(false);
    serviceInstall.mockClear();

    const args = includeJsonFlag
      ? ["daemon", "install", "--port", "18789", "--json"]
      : ["daemon", "install", "--port", "18789"];
    await runDaemonCommand(args);

    expect(serviceInstall).toHaveBeenCalledTimes(1);
    if (includeJsonFlag) {
      const parsed = parseFirstJsonRuntimeLine<{
        ok?: boolean;
        action?: string;
        result?: string;
      }>();
      expect(parsed.ok).toBe(true);
      expect(parsed.action).toBe("install");
      expect(parsed.result).toBe("installed");
    }
  });

  it.each([
    { label: "plain output", includeJsonFlag: false },
    { label: "json output", includeJsonFlag: true },
  ])("starts and stops daemon ($label)", async ({ includeJsonFlag }) => {
    resetRuntimeCapture();
    serviceRestart.mockClear();
    serviceStop.mockClear();
    serviceIsLoaded.mockResolvedValue(true);

    const startArgs = includeJsonFlag ? ["daemon", "start", "--json"] : ["daemon", "start"];
    const stopArgs = includeJsonFlag ? ["daemon", "stop", "--json"] : ["daemon", "stop"];
    await runDaemonCommand(startArgs);
    await runDaemonCommand(stopArgs);

    expect(serviceRestart).toHaveBeenCalledTimes(1);
    expect(serviceStop).toHaveBeenCalledTimes(1);
    if (includeJsonFlag) {
      const jsonLines = runtimeLogs.filter((line) => line.trim().startsWith("{"));
      const parsed = jsonLines.map((line) => JSON.parse(line) as { action?: string; ok?: boolean });
      expect(parsed.some((entry) => entry.action === "start" && entry.ok === true)).toBe(true);
      expect(parsed.some((entry) => entry.action === "stop" && entry.ok === true)).toBe(true);
    }
  });
});
