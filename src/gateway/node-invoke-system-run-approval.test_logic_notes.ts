/*
 * AUTO ANNOTATION
 * File: src/gateway/node-invoke-system-run-approval.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, test } from "vitest";
import type { ExecApprovalRecord } from "./exec-approval-manager.js";
import { sanitizeSystemRunParamsForForwarding } from "./node-invoke-system-run-approval.js";

describe("sanitizeSystemRunParamsForForwarding", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const now = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const client = {
    connId: "conn-1",
    connect: {
      scopes: ["operator.write", "operator.approvals"],
      device: { id: "dev-1" },
      client: { id: "cli-1" },
    },
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function makeRecord(command: string): ExecApprovalRecord {
    return {
      id: "approval-1",
      request: {
        host: "node",
        command,
        cwd: null,
        agentId: null,
        sessionKey: null,
      },
      createdAtMs: now - 1_000,
      expiresAtMs: now + 60_000,
      requestedByConnId: "conn-1",
      requestedByDeviceId: "dev-1",
      requestedByClientId: "cli-1",
      resolvedAtMs: now - 500,
      decision: "allow-once",
      resolvedBy: "operator",
    };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function manager(record: ReturnType<typeof makeRecord>) {
    return {
      getSnapshot: () => record,
    };
  }

  test("rejects cmd.exe /c trailing-arg mismatch against rawCommand", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = sanitizeSystemRunParamsForForwarding({
      rawParams: {
        command: ["cmd.exe", "/d", "/s", "/c", "echo", "SAFE&&whoami"],
        rawCommand: "echo",
        runId: "approval-1",
        approved: true,
        approvalDecision: "allow-once",
      },
      client,
      execApprovalManager: manager(makeRecord("echo")),
      nowMs: now,
    });
    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("unreachable");
    }
    expect(result.message).toContain("rawCommand does not match command");
    expect(result.details?.code).toBe("RAW_COMMAND_MISMATCH");
  });

  test("accepts matching cmd.exe /c command text for approval binding", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = sanitizeSystemRunParamsForForwarding({
      rawParams: {
        command: ["cmd.exe", "/d", "/s", "/c", "echo", "SAFE&&whoami"],
        rawCommand: "echo SAFE&&whoami",
        runId: "approval-1",
        approved: true,
        approvalDecision: "allow-once",
      },
      client,
      execApprovalManager: manager(makeRecord("echo SAFE&&whoami")),
      nowMs: now,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("unreachable");
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const params = result.params as Record<string, unknown>;
    expect(params.approved).toBe(true);
    expect(params.approvalDecision).toBe("allow-once");
  });
});
