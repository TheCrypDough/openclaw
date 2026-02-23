# AUTOPLACEHOLDER_ANNOTATION: src/cli/program/register.configure.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { Command } from "commander";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const configureCommandFromSectionsArgMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const runtime = {
  log: vi.fn(),
  error: vi.fn(),
  exit: vi.fn(),
};

vi.mock("../../commands/configure.js", () => ({
  CONFIGURE_WIZARD_SECTIONS: ["auth", "channels", "gateway", "agent"],
  configureCommandFromSectionsArg: configureCommandFromSectionsArgMock,
}));

vi.mock("../../runtime.js", () => ({
  defaultRuntime: runtime,
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let registerConfigureCommand: typeof import("./register.configure.js").registerConfigureCommand;

beforeAll(async () => {
  ({ registerConfigureCommand } = await import("./register.configure.js"));
});

describe("registerConfigureCommand", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function runCli(args: string[]) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const program = new Command();
    registerConfigureCommand(program);
    await program.parseAsync(args, { from: "user" });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    configureCommandFromSectionsArgMock.mockResolvedValue(undefined);
  });

  it("forwards repeated --section values", async () => {
    await runCli(["configure", "--section", "auth", "--section", "channels"]);

    expect(configureCommandFromSectionsArgMock).toHaveBeenCalledWith(["auth", "channels"], runtime);
  });

  it("reports errors through runtime when configure command fails", async () => {
    configureCommandFromSectionsArgMock.mockRejectedValueOnce(new Error("configure failed"));

    await runCli(["configure"]);

    expect(runtime.error).toHaveBeenCalledWith("Error: configure failed");
    expect(runtime.exit).toHaveBeenCalledWith(1);
  });
});
