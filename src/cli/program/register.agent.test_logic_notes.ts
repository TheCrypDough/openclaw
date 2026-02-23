/*
 * AUTO ANNOTATION
 * File: src/cli/program/register.agent.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Command } from "commander";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const agentCliCommandMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const agentsAddCommandMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const agentsDeleteCommandMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const agentsListCommandMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const agentsSetIdentityCommandMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const setVerboseMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const createDefaultDepsMock = vi.fn(() => ({ deps: true }));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const runtime = {
  log: vi.fn(),
  error: vi.fn(),
  exit: vi.fn(),
};

vi.mock("../../commands/agent-via-gateway.js", () => ({
  agentCliCommand: agentCliCommandMock,
}));

vi.mock("../../commands/agents.js", () => ({
  agentsAddCommand: agentsAddCommandMock,
  agentsDeleteCommand: agentsDeleteCommandMock,
  agentsListCommand: agentsListCommandMock,
  agentsSetIdentityCommand: agentsSetIdentityCommandMock,
}));

vi.mock("../../globals.js", () => ({
  setVerbose: setVerboseMock,
}));

vi.mock("../deps.js", () => ({
  createDefaultDeps: createDefaultDepsMock,
}));

vi.mock("../../runtime.js", () => ({
  defaultRuntime: runtime,
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let registerAgentCommands: typeof import("./register.agent.js").registerAgentCommands;

beforeAll(async () => {
  ({ registerAgentCommands } = await import("./register.agent.js"));
});

describe("registerAgentCommands", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function runCli(args: string[]) {
    const program = new Command();
    registerAgentCommands(program, { agentChannelOptions: "last|telegram|discord" });
    await program.parseAsync(args, { from: "user" });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    agentCliCommandMock.mockResolvedValue(undefined);
    agentsAddCommandMock.mockResolvedValue(undefined);
    agentsDeleteCommandMock.mockResolvedValue(undefined);
    agentsListCommandMock.mockResolvedValue(undefined);
    agentsSetIdentityCommandMock.mockResolvedValue(undefined);
    createDefaultDepsMock.mockReturnValue({ deps: true });
  });

  it("runs agent command with deps and verbose enabled for --verbose on", async () => {
    await runCli(["agent", "--message", "hi", "--verbose", "ON", "--json"]);

    expect(setVerboseMock).toHaveBeenCalledWith(true);
    expect(createDefaultDepsMock).toHaveBeenCalledTimes(1);
    expect(agentCliCommandMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "hi",
        verbose: "ON",
        json: true,
      }),
      runtime,
      { deps: true },
    );
  });

  it("runs agent command with verbose disabled for --verbose off", async () => {
    await runCli(["agent", "--message", "hi", "--verbose", "off"]);

    expect(setVerboseMock).toHaveBeenCalledWith(false);
    expect(agentCliCommandMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "hi",
        verbose: "off",
      }),
      runtime,
      { deps: true },
    );
  });

  it("runs agents add and computes hasFlags based on explicit options", async () => {
    await runCli(["agents", "add", "alpha"]);
    expect(agentsAddCommandMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        name: "alpha",
        workspace: undefined,
        bind: [],
      }),
      runtime,
      { hasFlags: false },
    );

    await runCli([
      "agents",
      "add",
      "beta",
      "--workspace",
      "/tmp/ws",
      "--bind",
      "telegram",
      "--bind",
      "discord:acct",
      "--non-interactive",
      "--json",
    ]);
    expect(agentsAddCommandMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        name: "beta",
        workspace: "/tmp/ws",
        bind: ["telegram", "discord:acct"],
        nonInteractive: true,
        json: true,
      }),
      runtime,
      { hasFlags: true },
    );
  });

  it("runs agents list when root agents command is invoked", async () => {
    await runCli(["agents"]);
    expect(agentsListCommandMock).toHaveBeenCalledWith({}, runtime);
  });

  it("forwards agents list options", async () => {
    await runCli(["agents", "list", "--json", "--bindings"]);
    expect(agentsListCommandMock).toHaveBeenCalledWith(
      {
        json: true,
        bindings: true,
      },
      runtime,
    );
  });

  it("forwards agents delete options", async () => {
    await runCli(["agents", "delete", "worker-a", "--force", "--json"]);
    expect(agentsDeleteCommandMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "worker-a",
        force: true,
        json: true,
      }),
      runtime,
    );
  });

  it("forwards set-identity options", async () => {
    await runCli([
      "agents",
      "set-identity",
      "--agent",
      "main",
      "--workspace",
      "/tmp/ws",
      "--identity-file",
      "/tmp/ws/IDENTITY.md",
      "--from-identity",
      "--name",
      "OpenClaw",
      "--theme",
      "ops",
      "--emoji",
      ":lobster:",
      "--avatar",
      "https://example.com/openclaw.png",
      "--json",
    ]);
    expect(agentsSetIdentityCommandMock).toHaveBeenCalledWith(
      {
        agent: "main",
        workspace: "/tmp/ws",
        identityFile: "/tmp/ws/IDENTITY.md",
        fromIdentity: true,
        name: "OpenClaw",
        theme: "ops",
        emoji: ":lobster:",
        avatar: "https://example.com/openclaw.png",
        json: true,
      },
      runtime,
    );
  });

  it("reports errors via runtime when a command fails", async () => {
    agentsListCommandMock.mockRejectedValueOnce(new Error("list failed"));

    await runCli(["agents"]);

    expect(runtime.error).toHaveBeenCalledWith("Error: list failed");
    expect(runtime.exit).toHaveBeenCalledWith(1);
  });

  it("reports errors via runtime when agent command fails", async () => {
    agentCliCommandMock.mockRejectedValueOnce(new Error("agent failed"));

    await runCli(["agent", "--message", "hello"]);

    expect(runtime.error).toHaveBeenCalledWith("Error: agent failed");
    expect(runtime.exit).toHaveBeenCalledWith(1);
  });
});
