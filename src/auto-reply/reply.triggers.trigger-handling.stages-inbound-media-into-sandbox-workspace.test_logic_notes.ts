/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply.triggers.trigger-handling.stages-inbound-media-into-sandbox-workspace.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import { basename, join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createSandboxMediaContexts,
  createSandboxMediaStageConfig,
  withSandboxMediaTempHome,
} from "./stage-sandbox-media.test-harness.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const sandboxMocks = vi.hoisted(() => ({
  ensureSandboxWorkspaceForSession: vi.fn(),
}));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const childProcessMocks = vi.hoisted(() => ({
  spawn: vi.fn(),
}));

vi.mock("../agents/sandbox.js", () => sandboxMocks);
vi.mock("node:child_process", () => childProcessMocks);

import { ensureSandboxWorkspaceForSession } from "../agents/sandbox.js";
import { stageSandboxMedia } from "./reply/stage-sandbox-media.js";

afterEach(() => {
  vi.restoreAllMocks();
  childProcessMocks.spawn.mockReset();
});

describe("stageSandboxMedia", () => {
  it("stages inbound media into the sandbox workspace", async () => {
    await withSandboxMediaTempHome("openclaw-triggers-", async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const inboundDir = join(home, ".openclaw", "media", "inbound");
      await fs.mkdir(inboundDir, { recursive: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const mediaPath = join(inboundDir, "photo.jpg");
      await fs.writeFile(mediaPath, "test");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const sandboxDir = join(home, "sandboxes", "session");
      vi.mocked(ensureSandboxWorkspaceForSession).mockResolvedValue({
        workspaceDir: sandboxDir,
        containerWorkdir: "/work",
      });

      const { ctx, sessionCtx } = createSandboxMediaContexts(mediaPath);

      await stageSandboxMedia({
        ctx,
        sessionCtx,
        cfg: createSandboxMediaStageConfig(home),
        sessionKey: "agent:main:main",
        workspaceDir: join(home, "openclaw"),
      });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const stagedPath = `media/inbound/${basename(mediaPath)}`;
      expect(ctx.MediaPath).toBe(stagedPath);
      expect(sessionCtx.MediaPath).toBe(stagedPath);
      expect(ctx.MediaUrl).toBe(stagedPath);
      expect(sessionCtx.MediaUrl).toBe(stagedPath);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const stagedFullPath = join(sandboxDir, "media", "inbound", basename(mediaPath));
      await expect(fs.stat(stagedFullPath)).resolves.toBeTruthy();
    });
  });

  it("rejects staging host files from outside the media directory", async () => {
    await withSandboxMediaTempHome("openclaw-triggers-bypass-", async (home) => {
      // Sensitive host file outside .openclaw
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const sensitiveFile = join(home, "secrets.txt");
      await fs.writeFile(sensitiveFile, "SENSITIVE DATA");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const sandboxDir = join(home, "sandboxes", "session");
      vi.mocked(ensureSandboxWorkspaceForSession).mockResolvedValue({
        workspaceDir: sandboxDir,
        containerWorkdir: "/work",
      });

      const { ctx, sessionCtx } = createSandboxMediaContexts(sensitiveFile);

      // This should fail or skip the file
      await stageSandboxMedia({
        ctx,
        sessionCtx,
        cfg: createSandboxMediaStageConfig(home),
        sessionKey: "agent:main:main",
        workspaceDir: join(home, "openclaw"),
      });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const stagedFullPath = join(sandboxDir, "media", "inbound", basename(sensitiveFile));
      // Expect the file NOT to be staged
      await expect(fs.stat(stagedFullPath)).rejects.toThrow();

      // Context should NOT be rewritten to a sandbox path if it failed to stage
      expect(ctx.MediaPath).toBe(sensitiveFile);
    });
  });

  it("blocks remote SCP staging for non-iMessage attachment paths", async () => {
    await withSandboxMediaTempHome("openclaw-triggers-remote-block-", async (home) => {
      const sandboxDir = join(home, "sandboxes", "session");
      vi.mocked(ensureSandboxWorkspaceForSession).mockResolvedValue({
        workspaceDir: sandboxDir,
        containerWorkdir: "/work",
      });

      const { ctx, sessionCtx } = createSandboxMediaContexts("/etc/passwd");
      ctx.Provider = "imessage";
      ctx.MediaRemoteHost = "user@gateway-host";
      sessionCtx.Provider = "imessage";
      sessionCtx.MediaRemoteHost = "user@gateway-host";

      await stageSandboxMedia({
        ctx,
        sessionCtx,
        cfg: createSandboxMediaStageConfig(home),
        sessionKey: "agent:main:main",
        workspaceDir: join(home, "openclaw"),
      });

      expect(childProcessMocks.spawn).not.toHaveBeenCalled();
      expect(ctx.MediaPath).toBe("/etc/passwd");
    });
  });
});
