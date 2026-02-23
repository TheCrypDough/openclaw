/*
 * AUTO ANNOTATION
 * File: src/process/supervisor/adapters/child.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ChildProcessWithoutNullStreams, SpawnOptions } from "node:child_process";
import { killProcessTree } from "../../kill-tree.js";
import { spawnWithFallback } from "../../spawn-utils.js";
import type { ManagedRunStdin } from "../types.js";
import { toStringEnv } from "./env.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveCommand(command: string): string {
  if (process.platform !== "win32") {
    return command;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const lower = command.toLowerCase();
  if (lower.endsWith(".exe") || lower.endsWith(".cmd") || lower.endsWith(".bat")) {
    return command;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const basename = lower.split(/[\\/]/).pop() ?? lower;
  if (basename === "npm" || basename === "pnpm" || basename === "yarn" || basename === "npx") {
    return `${command}.cmd`;
  }
  return command;
}

export type ChildAdapter = {
  pid?: number;
  stdin?: ManagedRunStdin;
  onStdout: (listener: (chunk: string) => void) => void;
  onStderr: (listener: (chunk: string) => void) => void;
  wait: () => Promise<{ code: number | null; signal: NodeJS.Signals | null }>;
  kill: (signal?: NodeJS.Signals) => void;
  dispose: () => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function createChildAdapter(params: {
  argv: string[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  windowsVerbatimArguments?: boolean;
  input?: string;
  stdinMode?: "inherit" | "pipe-open" | "pipe-closed";
}): Promise<ChildAdapter> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolvedArgv = [...params.argv];
  resolvedArgv[0] = resolveCommand(resolvedArgv[0] ?? "");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stdinMode = params.stdinMode ?? (params.input !== undefined ? "pipe-closed" : "inherit");

  // On Windows, `detached: true` creates a new process group and can prevent
  // stdout/stderr pipes from connecting when running under a Scheduled Task
  // (headless, no console). Default to `detached: false` on Windows; on
  // POSIX systems keep `detached: true` so the child survives parent exit.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const useDetached = process.platform !== "win32";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const options: SpawnOptions = {
    cwd: params.cwd,
    env: params.env ? toStringEnv(params.env) : undefined,
    stdio: ["pipe", "pipe", "pipe"],
    detached: useDetached,
    windowsHide: true,
    windowsVerbatimArguments: params.windowsVerbatimArguments,
  };
  if (stdinMode === "inherit") {
    options.stdio = ["inherit", "pipe", "pipe"];
  } else {
    options.stdio = ["pipe", "pipe", "pipe"];
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const spawned = await spawnWithFallback({
    argv: resolvedArgv,
    options,
    fallbacks: useDetached
      ? [
          {
            label: "no-detach",
            options: { detached: false },
          },
        ]
      : [],
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const child = spawned.child as ChildProcessWithoutNullStreams;
  if (child.stdin) {
    if (params.input !== undefined) {
      child.stdin.write(params.input);
      child.stdin.end();
    } else if (stdinMode === "pipe-closed") {
      child.stdin.end();
    }
  }

  const stdin: ManagedRunStdin | undefined = child.stdin
    ? {
        destroyed: false,
        write: (data: string, cb?: (err?: Error | null) => void) => {
          try {
            child.stdin.write(data, cb);
          } catch (err) {
            cb?.(err as Error);
          }
        },
        end: () => {
          try {
            child.stdin.end();
          } catch {
            // ignore close errors
          }
        },
        destroy: () => {
          try {
            child.stdin.destroy();
          } catch {
            // ignore destroy errors
          }
        },
      }
    : undefined;

  const onStdout = (listener: (chunk: string) => void) => {
    child.stdout.on("data", (chunk) => {
      listener(chunk.toString());
    });
  };

  const onStderr = (listener: (chunk: string) => void) => {
    child.stderr.on("data", (chunk) => {
      listener(chunk.toString());
    });
  };

  const wait = async () =>
    await new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve, reject) => {
      child.once("error", reject);
      child.once("close", (code, signal) => {
        resolve({ code, signal });
      });
    });

  const kill = (signal?: NodeJS.Signals) => {
    const pid = child.pid ?? undefined;
    if (signal === undefined || signal === "SIGKILL") {
      if (pid) {
        killProcessTree(pid);
      } else {
        try {
          child.kill("SIGKILL");
        } catch {
          // ignore kill errors
        }
      }
      return;
    }
    try {
      child.kill(signal);
    } catch {
      // ignore kill errors for non-kill signals
    }
  };

  const dispose = () => {
    child.removeAllListeners();
  };

  return {
    pid: child.pid ?? undefined,
    stdin,
    onStdout,
    onStderr,
    wait,
    kill,
    dispose,
  };
}
