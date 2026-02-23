/*
 * AUTO ANNOTATION
 * File: src/cli/program/register.setup.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Command } from "commander";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const setupCommandMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const onboardCommandMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const runtime = {
  log: vi.fn(),
  error: vi.fn(),
  exit: vi.fn(),
};

vi.mock("../../commands/setup.js", () => ({
  setupCommand: setupCommandMock,
}));

vi.mock("../../commands/onboard.js", () => ({
  onboardCommand: onboardCommandMock,
}));

vi.mock("../../runtime.js", () => ({
  defaultRuntime: runtime,
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let registerSetupCommand: typeof import("./register.setup.js").registerSetupCommand;

beforeAll(async () => {
  ({ registerSetupCommand } = await import("./register.setup.js"));
});

describe("registerSetupCommand", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function runCli(args: string[]) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const program = new Command();
    registerSetupCommand(program);
    await program.parseAsync(args, { from: "user" });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    setupCommandMock.mockResolvedValue(undefined);
    onboardCommandMock.mockResolvedValue(undefined);
  });

  it("runs setup command by default", async () => {
    await runCli(["setup", "--workspace", "/tmp/ws"]);

    expect(setupCommandMock).toHaveBeenCalledWith(
      expect.objectContaining({
        workspace: "/tmp/ws",
      }),
      runtime,
    );
    expect(onboardCommandMock).not.toHaveBeenCalled();
  });

  it("runs onboard command when --wizard is set", async () => {
    await runCli(["setup", "--wizard", "--mode", "remote", "--remote-url", "wss://example"]);

    expect(onboardCommandMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "remote",
        remoteUrl: "wss://example",
      }),
      runtime,
    );
    expect(setupCommandMock).not.toHaveBeenCalled();
  });

  it("runs onboard command when wizard-only flags are passed explicitly", async () => {
    await runCli(["setup", "--mode", "remote", "--non-interactive"]);

    expect(onboardCommandMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "remote",
        nonInteractive: true,
      }),
      runtime,
    );
    expect(setupCommandMock).not.toHaveBeenCalled();
  });

  it("reports setup errors through runtime", async () => {
    setupCommandMock.mockRejectedValueOnce(new Error("setup failed"));

    await runCli(["setup"]);

    expect(runtime.error).toHaveBeenCalledWith("Error: setup failed");
    expect(runtime.exit).toHaveBeenCalledWith(1);
  });
});
