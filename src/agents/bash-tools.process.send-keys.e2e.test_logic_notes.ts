/*
 * AUTO ANNOTATION
 * File: src/agents/bash-tools.process.send-keys.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, expect, test } from "vitest";
import { resetProcessRegistryForTests } from "./bash-process-registry.js";
import { createExecTool } from "./bash-tools.exec.js";
import { createProcessTool } from "./bash-tools.process.js";

afterEach(() => {
  resetProcessRegistryForTests();
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function startPtySession(command: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const execTool = createExecTool();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const processTool = createProcessTool();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = await execTool.execute("toolcall", {
    command,
    pty: true,
    background: true,
  });

  expect(result.details.status).toBe("running");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sessionId = (result.details as { sessionId: string }).sessionId;
  expect(sessionId).toBeTruthy();
  return { processTool, sessionId };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function waitForSessionCompletion(params: {
  processTool: ReturnType<typeof createProcessTool>;
  sessionId: string;
  expectedText: string;
}) {
  await expect
    .poll(
      async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const poll = await params.processTool.execute("toolcall", {
          action: "poll",
          sessionId: params.sessionId,
        });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const details = poll.details as { status?: string; aggregated?: string };
        if (details.status === "running") {
          return false;
        }
        expect(details.status).toBe("completed");
        expect(details.aggregated ?? "").toContain(params.expectedText);
        return true;
      },
      {
        timeout: process.platform === "win32" ? 4000 : 2000,
        interval: 50,
      },
    )
    .toBe(true);
}

test("process send-keys encodes Enter for pty sessions", async () => {
  const { processTool, sessionId } = await startPtySession(
    'node -e "const dataEvent=String.fromCharCode(100,97,116,97);process.stdin.on(dataEvent,d=>{process.stdout.write(d);if(d.includes(10)||d.includes(13))process.exit(0);});"',
  );

  await processTool.execute("toolcall", {
    action: "send-keys",
    sessionId,
    keys: ["h", "i", "Enter"],
  });

  await waitForSessionCompletion({ processTool, sessionId, expectedText: "hi" });
});

test("process submit sends Enter for pty sessions", async () => {
  const { processTool, sessionId } = await startPtySession(
    'node -e "const dataEvent=String.fromCharCode(100,97,116,97);const submitted=String.fromCharCode(115,117,98,109,105,116,116,101,100);process.stdin.on(dataEvent,d=>{if(d.includes(10)||d.includes(13)){process.stdout.write(submitted);process.exit(0);}});"',
  );

  await processTool.execute("toolcall", {
    action: "submit",
    sessionId,
  });

  await waitForSessionCompletion({ processTool, sessionId, expectedText: "submitted" });
});
