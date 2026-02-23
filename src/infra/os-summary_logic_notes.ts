/*
 * AUTO ANNOTATION
 * File: src/infra/os-summary.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { spawnSync } from "node:child_process";
import os from "node:os";

export type OsSummary = {
  platform: NodeJS.Platform;
  arch: string;
  release: string;
  label: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function safeTrim(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function macosVersion(): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const res = spawnSync("sw_vers", ["-productVersion"], { encoding: "utf-8" });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const out = safeTrim(res.stdout);
  return out || os.release();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveOsSummary(): OsSummary {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const platform = os.platform();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const release = os.release();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const arch = os.arch();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const label = (() => {
    if (platform === "darwin") {
      return `macos ${macosVersion()} (${arch})`;
    }
    if (platform === "win32") {
      return `windows ${release} (${arch})`;
    }
    return `${platform} ${release} (${arch})`;
  })();
  return { platform, arch, release, label };
}
