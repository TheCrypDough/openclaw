/*
 * AUTO ANNOTATION
 * File: src/agents/bash-tools.exec.pty-fallback.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, expect, test, vi } from "vitest";
import { resetProcessRegistryForTests } from "./bash-process-registry.js";
import { createExecTool } from "./bash-tools.exec.js";

vi.mock("@lydell/node-pty", () => ({
  spawn: () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const err = new Error("spawn EBADF");
    (err as NodeJS.ErrnoException).code = "EBADF";
    throw err;
  },
}));

afterEach(() => {
  resetProcessRegistryForTests();
  vi.clearAllMocks();
});

test("exec falls back when PTY spawn fails", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tool = createExecTool({ allowBackground: false });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = await tool.execute("toolcall", {
    command: "printf ok",
    pty: true,
  });

  expect(result.details.status).toBe("completed");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const text = result.content?.find((item) => item.type === "text")?.text ?? "";
  expect(text).toContain("ok");
  expect(text).toContain("PTY spawn failed");
});
