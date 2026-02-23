/*
 * AUTO ANNOTATION
 * File: src/agents/test-helpers/pi-tools-sandbox-context.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createPiToolsSandboxContext } from "./pi-tools-sandbox-context.js";

describe("createPiToolsSandboxContext", () => {
  it("provides stable defaults for pi-tools sandbox tests", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sandbox = createPiToolsSandboxContext({
      workspaceDir: "/tmp/sandbox",
    });

    expect(sandbox.enabled).toBe(true);
    expect(sandbox.sessionKey).toBe("sandbox:test");
    expect(sandbox.workspaceDir).toBe("/tmp/sandbox");
    expect(sandbox.agentWorkspaceDir).toBe("/tmp/sandbox");
    expect(sandbox.workspaceAccess).toBe("rw");
    expect(sandbox.containerName).toBe("openclaw-sbx-test");
    expect(sandbox.containerWorkdir).toBe("/workspace");
    expect(sandbox.docker.image).toBe("openclaw-sandbox:bookworm-slim");
    expect(sandbox.docker.containerPrefix).toBe("openclaw-sbx-");
    expect(sandbox.tools).toEqual({ allow: [], deny: [] });
    expect(sandbox.browserAllowHostControl).toBe(false);
  });

  it("applies provided overrides", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const sandbox = createPiToolsSandboxContext({
      workspaceDir: "/tmp/sandbox",
      agentWorkspaceDir: "/tmp/workspace",
      workspaceAccess: "ro",
      tools: { allow: ["read"], deny: ["exec"] },
      browserAllowHostControl: true,
      dockerOverrides: {
        readOnlyRoot: false,
        tmpfs: ["/tmp"],
      },
    });

    expect(sandbox.agentWorkspaceDir).toBe("/tmp/workspace");
    expect(sandbox.workspaceAccess).toBe("ro");
    expect(sandbox.tools).toEqual({ allow: ["read"], deny: ["exec"] });
    expect(sandbox.browserAllowHostControl).toBe(true);
    expect(sandbox.docker.readOnlyRoot).toBe(false);
    expect(sandbox.docker.tmpfs).toEqual(["/tmp"]);
  });
});
