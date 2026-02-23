/*
 * AUTO ANNOTATION
 * File: src/agents/bash-tools.exec.pty.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, expect, test } from "vitest";
import { resetProcessRegistryForTests } from "./bash-process-registry.js";
import { createExecTool } from "./bash-tools.exec.js";

afterEach(() => {
  resetProcessRegistryForTests();
});

test("exec supports pty output", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const tool = createExecTool({ allowBackground: false });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = await tool.execute("toolcall", {
    command: 'node -e "process.stdout.write(String.fromCharCode(111,107))"',
    pty: true,
  });

  expect(result.details.status).toBe("completed");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const text = result.content?.find((item) => item.type === "text")?.text ?? "";
  expect(text).toContain("ok");
});
