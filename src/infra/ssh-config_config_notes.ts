# AUTOPLACEHOLDER_ANNOTATION: src/infra/ssh-config.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { spawn } from "node:child_process";
import type { SshParsedTarget } from "./ssh-tunnel.js";

export type SshResolvedConfig = {
  user?: string;
  host?: string;
  port?: number;
  identityFiles: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parsePort(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }
  return parsed;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseSshConfigOutput(output: string): SshResolvedConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result: SshResolvedConfig = { identityFiles: [] };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lines = output.split("\n");
  for (const raw of lines) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const line = raw.trim();
    if (!line) {
      continue;
    }
    const [key, ...rest] = line.split(/\s+/);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = rest.join(" ").trim();
    if (!key || !value) {
      continue;
    }
    switch (key) {
      case "user":
        result.user = value;
        break;
      case "hostname":
        result.host = value;
        break;
      case "port":
        result.port = parsePort(value);
        break;
      case "identityfile":
        if (value !== "none") {
          result.identityFiles.push(value);
        }
        break;
      default:
        break;
    }
  }
  return result;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveSshConfig(
  target: SshParsedTarget,
  opts: { identity?: string; timeoutMs?: number } = {},
): Promise<SshResolvedConfig | null> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sshPath = "/usr/bin/ssh";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const args = ["-G"];
  if (target.port > 0 && target.port !== 22) {
    args.push("-p", String(target.port));
  }
  if (opts.identity?.trim()) {
    args.push("-i", opts.identity.trim());
  }
  const userHost = target.user ? `${target.user}@${target.host}` : target.host;
  // Use "--" so userHost can't be parsed as an ssh option.
  args.push("--", userHost);

  return await new Promise<SshResolvedConfig | null>((resolve) => {
    const child = spawn(sshPath, args, {
      stdio: ["ignore", "pipe", "ignore"],
    });
    let stdout = "";
    child.stdout?.setEncoding("utf8");
    child.stdout?.on("data", (chunk) => {
      stdout += String(chunk);
    });

    const timeoutMs = Math.max(200, opts.timeoutMs ?? 800);
    const timer = setTimeout(() => {
      try {
        child.kill("SIGKILL");
      } finally {
        resolve(null);
      }
    }, timeoutMs);

    child.once("error", () => {
      clearTimeout(timer);
      resolve(null);
    });
    child.once("exit", (code) => {
      clearTimeout(timer);
      if (code !== 0 || !stdout.trim()) {
        resolve(null);
        return;
      }
      resolve(parseSshConfigOutput(stdout));
    });
  });
}
