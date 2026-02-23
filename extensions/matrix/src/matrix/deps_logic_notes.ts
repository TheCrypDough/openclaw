/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/deps.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RuntimeEnv } from "openclaw/plugin-sdk";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const MATRIX_SDK_PACKAGE = "@vector-im/matrix-bot-sdk";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isMatrixSdkAvailable(): boolean {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const req = createRequire(import.meta.url);
    req.resolve(MATRIX_SDK_PACKAGE);
    return true;
  } catch {
    return false;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolvePluginRoot(): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(currentDir, "..", "..");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type CommandResult = {
  code: number;
  stdout: string;
  stderr: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function runFixedCommandWithTimeout(params: {
  argv: string[];
  cwd: string;
  timeoutMs: number;
  env?: NodeJS.ProcessEnv;
}): Promise<CommandResult> {
  return await new Promise((resolve) => {
    const [command, ...args] = params.argv;
    if (!command) {
      resolve({
        code: 1,
        stdout: "",
        stderr: "command is required",
      });
      return;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const proc = spawn(command, args, {
      cwd: params.cwd,
      env: { ...process.env, ...params.env },
      stdio: ["ignore", "pipe", "pipe"],
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let stdout = "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let stderr = "";
    let settled = false;
    let timer: NodeJS.Timeout | null = null;

    const finalize = (result: CommandResult) => {
      if (settled) {
        return;
      }
      settled = true;
      if (timer) {
        clearTimeout(timer);
      }
      resolve(result);
    };

    proc.stdout?.on("data", (chunk: Buffer | string) => {
      stdout += chunk.toString();
    });
    proc.stderr?.on("data", (chunk: Buffer | string) => {
      stderr += chunk.toString();
    });

    timer = setTimeout(() => {
      proc.kill("SIGKILL");
      finalize({
        code: 124,
        stdout,
        stderr: stderr || `command timed out after ${params.timeoutMs}ms`,
      });
    }, params.timeoutMs);

    proc.on("error", (err) => {
      finalize({
        code: 1,
        stdout,
        stderr: err.message,
      });
    });

    proc.on("close", (code) => {
      finalize({
        code: code ?? 1,
        stdout,
        stderr,
      });
    });
  });
}

export async function ensureMatrixSdkInstalled(params: {
  runtime: RuntimeEnv;
  confirm?: (message: string) => Promise<boolean>;
}): Promise<void> {
  if (isMatrixSdkAvailable()) {
    return;
  }
  const confirm = params.confirm;
  if (confirm) {
    const ok = await confirm("Matrix requires @vector-im/matrix-bot-sdk. Install now?");
    if (!ok) {
      throw new Error("Matrix requires @vector-im/matrix-bot-sdk (install dependencies first).");
    }
  }

  const root = resolvePluginRoot();
  const command = fs.existsSync(path.join(root, "pnpm-lock.yaml"))
    ? ["pnpm", "install"]
    : ["npm", "install", "--omit=dev", "--silent"];
  params.runtime.log?.(`matrix: installing dependencies via ${command[0]} (${root})…`);
  const result = await runFixedCommandWithTimeout({
    argv: command,
    cwd: root,
    timeoutMs: 300_000,
    env: { COREPACK_ENABLE_DOWNLOAD_PROMPT: "0" },
  });
  if (result.code !== 0) {
    throw new Error(
      result.stderr.trim() || result.stdout.trim() || "Matrix dependency install failed.",
    );
  }
  if (!isMatrixSdkAvailable()) {
    throw new Error(
      "Matrix dependency install completed but @vector-im/matrix-bot-sdk is still missing.",
    );
  }
}
