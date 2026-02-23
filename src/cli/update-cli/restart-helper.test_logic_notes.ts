/*
 * AUTO ANNOTATION
 * File: src/cli/update-cli/restart-helper.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs/promises";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { prepareRestartScript, runRestartScript } from "./restart-helper.js";

vi.mock("node:child_process", () => ({
  spawn: vi.fn(),
}));

describe("restart-helper", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const originalPlatform = process.platform;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const originalGetUid = process.getuid;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function prepareAndReadScript(env: Record<string, string>) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const scriptPath = await prepareRestartScript(env);
    expect(scriptPath).toBeTruthy();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const content = await fs.readFile(scriptPath!, "utf-8");
    return { scriptPath: scriptPath!, content };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function cleanupScript(scriptPath: string) {
    await fs.unlink(scriptPath);
  }

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(process, "platform", { value: originalPlatform });
    process.getuid = originalGetUid;
  });

  describe("prepareRestartScript", () => {
    it("creates a systemd restart script on Linux", async () => {
      Object.defineProperty(process, "platform", { value: "linux" });
      const { scriptPath, content } = await prepareAndReadScript({
        OPENCLAW_PROFILE: "default",
      });
      expect(scriptPath.endsWith(".sh")).toBe(true);
      expect(content).toContain("#!/bin/sh");
      expect(content).toContain("systemctl --user restart 'openclaw-gateway.service'");
      // Script should self-cleanup
      expect(content).toContain('rm -f "$0"');
      await cleanupScript(scriptPath);
    });

    it("uses OPENCLAW_SYSTEMD_UNIT override for systemd scripts", async () => {
      Object.defineProperty(process, "platform", { value: "linux" });
      const { scriptPath, content } = await prepareAndReadScript({
        OPENCLAW_PROFILE: "default",
        OPENCLAW_SYSTEMD_UNIT: "custom-gateway",
      });
      expect(content).toContain("systemctl --user restart 'custom-gateway.service'");
      await cleanupScript(scriptPath);
    });

    it("creates a launchd restart script on macOS", async () => {
      Object.defineProperty(process, "platform", { value: "darwin" });
      process.getuid = () => 501;

      const { scriptPath, content } = await prepareAndReadScript({
        OPENCLAW_PROFILE: "default",
      });
      expect(scriptPath.endsWith(".sh")).toBe(true);
      expect(content).toContain("#!/bin/sh");
      expect(content).toContain("launchctl kickstart -k 'gui/501/ai.openclaw.gateway'");
      expect(content).toContain('rm -f "$0"');
      await cleanupScript(scriptPath);
    });

    it("uses OPENCLAW_LAUNCHD_LABEL override on macOS", async () => {
      Object.defineProperty(process, "platform", { value: "darwin" });
      process.getuid = () => 501;

      const { scriptPath, content } = await prepareAndReadScript({
        OPENCLAW_PROFILE: "default",
        OPENCLAW_LAUNCHD_LABEL: "com.custom.openclaw",
      });
      expect(content).toContain("launchctl kickstart -k 'gui/501/com.custom.openclaw'");
      await cleanupScript(scriptPath);
    });

    it("creates a schtasks restart script on Windows", async () => {
      Object.defineProperty(process, "platform", { value: "win32" });

      const { scriptPath, content } = await prepareAndReadScript({
        OPENCLAW_PROFILE: "default",
      });
      expect(scriptPath.endsWith(".bat")).toBe(true);
      expect(content).toContain("@echo off");
      expect(content).toContain('schtasks /End /TN "OpenClaw Gateway"');
      expect(content).toContain('schtasks /Run /TN "OpenClaw Gateway"');
      // Batch self-cleanup
      expect(content).toContain('del "%~f0"');
      await cleanupScript(scriptPath);
    });

    it("uses OPENCLAW_WINDOWS_TASK_NAME override on Windows", async () => {
      Object.defineProperty(process, "platform", { value: "win32" });

      const { scriptPath, content } = await prepareAndReadScript({
        OPENCLAW_PROFILE: "default",
        OPENCLAW_WINDOWS_TASK_NAME: "OpenClaw Gateway (custom)",
      });
      expect(content).toContain('schtasks /End /TN "OpenClaw Gateway (custom)"');
      expect(content).toContain('schtasks /Run /TN "OpenClaw Gateway (custom)"');
      await cleanupScript(scriptPath);
    });

    it("uses custom profile in service names", async () => {
      Object.defineProperty(process, "platform", { value: "linux" });
      const { scriptPath, content } = await prepareAndReadScript({
        OPENCLAW_PROFILE: "production",
      });
      expect(content).toContain("openclaw-gateway-production.service");
      await cleanupScript(scriptPath);
    });

    it("uses custom profile in macOS launchd label", async () => {
      Object.defineProperty(process, "platform", { value: "darwin" });
      process.getuid = () => 502;

      const { scriptPath, content } = await prepareAndReadScript({
        OPENCLAW_PROFILE: "staging",
      });
      expect(content).toContain("gui/502/ai.openclaw.staging");
      await cleanupScript(scriptPath);
    });

    it("uses custom profile in Windows task name", async () => {
      Object.defineProperty(process, "platform", { value: "win32" });

      const { scriptPath, content } = await prepareAndReadScript({
        OPENCLAW_PROFILE: "production",
      });
      expect(content).toContain('schtasks /End /TN "OpenClaw Gateway (production)"');
      await cleanupScript(scriptPath);
    });

    it("returns null for unsupported platforms", async () => {
      Object.defineProperty(process, "platform", { value: "aix" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const scriptPath = await prepareRestartScript({});
      expect(scriptPath).toBeNull();
    });

    it("returns null when script creation fails", async () => {
      Object.defineProperty(process, "platform", { value: "linux" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const writeFileSpy = vi
        .spyOn(fs, "writeFile")
        .mockRejectedValueOnce(new Error("simulated write failure"));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const scriptPath = await prepareRestartScript({
        OPENCLAW_PROFILE: "default",
      });

      expect(scriptPath).toBeNull();
      writeFileSpy.mockRestore();
    });

    it("escapes single quotes in profile names for shell scripts", async () => {
      Object.defineProperty(process, "platform", { value: "linux" });
      const { scriptPath, content } = await prepareAndReadScript({
        OPENCLAW_PROFILE: "it's-a-test",
      });
      // Single quotes should be escaped with '\'' pattern
      expect(content).not.toContain("it's");
      expect(content).toContain("it'\\''s");
      await cleanupScript(scriptPath);
    });

    it("rejects unsafe batch profile names on Windows", async () => {
      Object.defineProperty(process, "platform", { value: "win32" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const scriptPath = await prepareRestartScript({
        OPENCLAW_PROFILE: "test&whoami",
      });

      expect(scriptPath).toBeNull();
    });
  });

  describe("runRestartScript", () => {
    it("spawns the script as a detached process on Linux", async () => {
      Object.defineProperty(process, "platform", { value: "linux" });
      const scriptPath = "/tmp/fake-script.sh";
      const mockChild = { unref: vi.fn() };
      vi.mocked(spawn).mockReturnValue(mockChild as unknown as ChildProcess);

      await runRestartScript(scriptPath);

      expect(spawn).toHaveBeenCalledWith("/bin/sh", [scriptPath], {
        detached: true,
        stdio: "ignore",
      });
      expect(mockChild.unref).toHaveBeenCalled();
    });

    it("uses cmd.exe on Windows", async () => {
      Object.defineProperty(process, "platform", { value: "win32" });
      const scriptPath = "C:\\Temp\\fake-script.bat";
      const mockChild = { unref: vi.fn() };
      vi.mocked(spawn).mockReturnValue(mockChild as unknown as ChildProcess);

      await runRestartScript(scriptPath);

      expect(spawn).toHaveBeenCalledWith("cmd.exe", ["/c", scriptPath], {
        detached: true,
        stdio: "ignore",
      });
      expect(mockChild.unref).toHaveBeenCalled();
    });
  });
});
