/*
 * AUTO ANNOTATION
 * File: src/signal/daemon.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { spawn } from "node:child_process";
import type { RuntimeEnv } from "../runtime.js";

export type SignalDaemonOpts = {
  cliPath: string;
  account?: string;
  httpHost: string;
  httpPort: number;
  receiveMode?: "on-start" | "manual";
  ignoreAttachments?: boolean;
  ignoreStories?: boolean;
  sendReadReceipts?: boolean;
  runtime?: RuntimeEnv;
};

export type SignalDaemonHandle = {
  pid?: number;
  stop: () => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function classifySignalCliLogLine(line: string): "log" | "error" | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }
  // signal-cli commonly writes all logs to stderr; treat severity explicitly.
  if (/\b(ERROR|WARN|WARNING)\b/.test(trimmed)) {
    return "error";
  }
  // Some signal-cli failures are not tagged with WARN/ERROR but should still be surfaced loudly.
  if (/\b(FAILED|SEVERE|EXCEPTION)\b/i.test(trimmed)) {
    return "error";
  }
  return "log";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function bindSignalCliOutput(params: {
  stream: NodeJS.ReadableStream | null | undefined;
  log: (message: string) => void;
  error: (message: string) => void;
}): void {
  params.stream?.on("data", (data) => {
    for (const line of data.toString().split(/\r?\n/)) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const kind = classifySignalCliLogLine(line);
      if (kind === "log") {
        params.log(`signal-cli: ${line.trim()}`);
      } else if (kind === "error") {
        params.error(`signal-cli: ${line.trim()}`);
      }
    }
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function buildDaemonArgs(opts: SignalDaemonOpts): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const args: string[] = [];
  if (opts.account) {
    args.push("-a", opts.account);
  }
  args.push("daemon");
  args.push("--http", `${opts.httpHost}:${opts.httpPort}`);
  args.push("--no-receive-stdout");

  if (opts.receiveMode) {
    args.push("--receive-mode", opts.receiveMode);
  }
  if (opts.ignoreAttachments) {
    args.push("--ignore-attachments");
  }
  if (opts.ignoreStories) {
    args.push("--ignore-stories");
  }
  if (opts.sendReadReceipts) {
    args.push("--send-read-receipts");
  }

  return args;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function spawnSignalDaemon(opts: SignalDaemonOpts): SignalDaemonHandle {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const args = buildDaemonArgs(opts);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const child = spawn(opts.cliPath, args, {
    stdio: ["ignore", "pipe", "pipe"],
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const log = opts.runtime?.log ?? (() => {});
  const error = opts.runtime?.error ?? (() => {});

  bindSignalCliOutput({ stream: child.stdout, log, error });
  bindSignalCliOutput({ stream: child.stderr, log, error });
  child.on("error", (err) => {
    error(`signal-cli spawn error: ${String(err)}`);
  });

  return {
    pid: child.pid ?? undefined,
    stop: () => {
      if (!child.killed) {
        child.kill("SIGTERM");
      }
    },
  };
}
