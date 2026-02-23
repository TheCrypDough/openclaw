/*
 * AUTO ANNOTATION
 * File: src/infra/system-run-command.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, test } from "vitest";
import {
  extractShellCommandFromArgv,
  formatExecCommand,
  resolveSystemRunCommand,
  validateSystemRunCommandConsistency,
} from "./system-run-command.js";

describe("system run command helpers", () => {
  test("formatExecCommand quotes args with spaces", () => {
    expect(formatExecCommand(["echo", "hi there"])).toBe('echo "hi there"');
  });

  test("extractShellCommandFromArgv extracts sh -lc command", () => {
    expect(extractShellCommandFromArgv(["/bin/sh", "-lc", "echo hi"])).toBe("echo hi");
  });

  test("extractShellCommandFromArgv extracts cmd.exe /c command", () => {
    expect(extractShellCommandFromArgv(["cmd.exe", "/d", "/s", "/c", "echo hi"])).toBe("echo hi");
  });

  test("extractShellCommandFromArgv includes trailing cmd.exe args after /c", () => {
    expect(extractShellCommandFromArgv(["cmd.exe", "/d", "/s", "/c", "echo", "SAFE&&whoami"])).toBe(
      "echo SAFE&&whoami",
    );
  });

  test("validateSystemRunCommandConsistency accepts rawCommand matching direct argv", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateSystemRunCommandConsistency({
      argv: ["echo", "hi"],
      rawCommand: "echo hi",
    });
    expect(res.ok).toBe(true);
    if (!res.ok) {
      throw new Error("unreachable");
    }
    expect(res.shellCommand).toBe(null);
    expect(res.cmdText).toBe("echo hi");
  });

  test("validateSystemRunCommandConsistency rejects mismatched rawCommand vs direct argv", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateSystemRunCommandConsistency({
      argv: ["uname", "-a"],
      rawCommand: "echo hi",
    });
    expect(res.ok).toBe(false);
    if (res.ok) {
      throw new Error("unreachable");
    }
    expect(res.message).toContain("rawCommand does not match command");
    expect(res.details?.code).toBe("RAW_COMMAND_MISMATCH");
  });

  test("validateSystemRunCommandConsistency accepts rawCommand matching sh wrapper argv", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateSystemRunCommandConsistency({
      argv: ["/bin/sh", "-lc", "echo hi"],
      rawCommand: "echo hi",
    });
    expect(res.ok).toBe(true);
  });

  test("validateSystemRunCommandConsistency rejects cmd.exe /c trailing-arg smuggling", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateSystemRunCommandConsistency({
      argv: ["cmd.exe", "/d", "/s", "/c", "echo", "SAFE&&whoami"],
      rawCommand: "echo",
    });
    expect(res.ok).toBe(false);
    if (res.ok) {
      throw new Error("unreachable");
    }
    expect(res.message).toContain("rawCommand does not match command");
    expect(res.details?.code).toBe("RAW_COMMAND_MISMATCH");
  });

  test("resolveSystemRunCommand requires command when rawCommand is present", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = resolveSystemRunCommand({ rawCommand: "echo hi" });
    expect(res.ok).toBe(false);
    if (res.ok) {
      throw new Error("unreachable");
    }
    expect(res.message).toContain("rawCommand requires params.command");
    expect(res.details?.code).toBe("MISSING_COMMAND");
  });

  test("resolveSystemRunCommand returns normalized argv and cmdText", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = resolveSystemRunCommand({
      command: ["cmd.exe", "/d", "/s", "/c", "echo", "SAFE&&whoami"],
      rawCommand: "echo SAFE&&whoami",
    });
    expect(res.ok).toBe(true);
    if (!res.ok) {
      throw new Error("unreachable");
    }
    expect(res.argv).toEqual(["cmd.exe", "/d", "/s", "/c", "echo", "SAFE&&whoami"]);
    expect(res.shellCommand).toBe("echo SAFE&&whoami");
    expect(res.cmdText).toBe("echo SAFE&&whoami");
  });
});
