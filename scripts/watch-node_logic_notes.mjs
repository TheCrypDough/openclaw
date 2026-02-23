/*
 * AUTO ANNOTATION
 * File: scripts/watch-node.mjs
 * Purpose: Operational script for maintenance/build/release/test workflows (watch-node.mjs).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
#!/usr/bin/env node
import { spawn } from "node:child_process";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { runNodeWatchedPaths } from "./run-node.mjs";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const WATCH_NODE_RUNNER = "scripts/run-node.mjs";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const buildWatchArgs = (args) => [
  ...runNodeWatchedPaths.flatMap((watchPath) => ["--watch-path", watchPath]),
  "--watch-preserve-output",
  WATCH_NODE_RUNNER,
  ...args,
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runWatchMain(params = {}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const deps = {
    spawn: params.spawn ?? spawn,
    process: params.process ?? process,
    cwd: params.cwd ?? process.cwd(),
    args: params.args ?? process.argv.slice(2),
    env: params.env ? { ...params.env } : { ...process.env },
    now: params.now ?? Date.now,
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const childEnv = { ...deps.env };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const watchSession = `${deps.now()}-${deps.process.pid}`;
  childEnv.OPENCLAW_WATCH_MODE = "1";
  childEnv.OPENCLAW_WATCH_SESSION = watchSession;
  if (deps.args.length > 0) {
    childEnv.OPENCLAW_WATCH_COMMAND = deps.args.join(" ");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const watchProcess = deps.spawn(deps.process.execPath, buildWatchArgs(deps.args), {
    cwd: deps.cwd,
    env: childEnv,
    stdio: "inherit",
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let settled = false;
  let onSigInt;
  let onSigTerm;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const settle = (resolve, code) => {
    if (settled) {
      return;
    }
    settled = true;
    if (onSigInt) {
      deps.process.off("SIGINT", onSigInt);
    }
    if (onSigTerm) {
      deps.process.off("SIGTERM", onSigTerm);
    }
    resolve(code);
  };

  return await new Promise((resolve) => {
    onSigInt = () => {
      if (typeof watchProcess.kill === "function") {
        watchProcess.kill("SIGTERM");
      }
      settle(resolve, 130);
    };
    onSigTerm = () => {
      if (typeof watchProcess.kill === "function") {
        watchProcess.kill("SIGTERM");
      }
      settle(resolve, 143);
    };

    deps.process.on("SIGINT", onSigInt);
    deps.process.on("SIGTERM", onSigTerm);

    watchProcess.on("exit", (code, signal) => {
      if (signal) {
        settle(resolve, 1);
        return;
      }
      settle(resolve, code ?? 1);
    });
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  void runWatchMain()
    .then((code) => process.exit(code))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
