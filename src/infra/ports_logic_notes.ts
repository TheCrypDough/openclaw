/*
 * AUTO ANNOTATION
 * File: src/infra/ports.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import net from "node:net";
import { danger, info, shouldLogVerbose, warn } from "../globals.js";
import { logDebug } from "../logger.js";
import type { RuntimeEnv } from "../runtime.js";
import { defaultRuntime } from "../runtime.js";
import { isErrno } from "./errors.js";
import { formatPortDiagnostics } from "./ports-format.js";
import { inspectPortUsage } from "./ports-inspect.js";
import type { PortListener, PortListenerKind, PortUsage, PortUsageStatus } from "./ports-types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
class PortInUseError extends Error {
  port: number;
  details?: string;

  constructor(port: number, details?: string) {
    super(`Port ${port} is already in use.`);
    this.name = "PortInUseError";
    this.port = port;
    this.details = details;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function describePortOwner(port: number): Promise<string | undefined> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const diagnostics = await inspectPortUsage(port);
  if (diagnostics.listeners.length === 0) {
    return undefined;
  }
  return formatPortDiagnostics(diagnostics).join("\n");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function ensurePortAvailable(port: number): Promise<void> {
  // Detect EADDRINUSE early with a friendly message.
  try {
    await new Promise<void>((resolve, reject) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const tester = net
        .createServer()
        .once("error", (err) => reject(err))
        .once("listening", () => {
          tester.close(() => resolve());
        })
        .listen(port);
    });
  } catch (err) {
    if (isErrno(err) && err.code === "EADDRINUSE") {
      throw new PortInUseError(port);
    }
    throw err;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function handlePortError(
  err: unknown,
  port: number,
  context: string,
  runtime: RuntimeEnv = defaultRuntime,
): Promise<never> {
  // Uniform messaging for EADDRINUSE with optional owner details.
  if (err instanceof PortInUseError || (isErrno(err) && err.code === "EADDRINUSE")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const details =
      err instanceof PortInUseError
        ? (err.details ?? (await describePortOwner(port)))
        : await describePortOwner(port);
    runtime.error(danger(`${context} failed: port ${port} is already in use.`));
    if (details) {
      runtime.error(info("Port listener details:"));
      runtime.error(details);
      if (/openclaw|src\/index\.ts|dist\/index\.js/.test(details)) {
        runtime.error(
          warn(
            "It looks like another OpenClaw instance is already running. Stop it or pick a different port.",
          ),
        );
      }
    }
    runtime.error(
      info("Resolve by stopping the process using the port or passing --port <free-port>."),
    );
    runtime.exit(1);
  }
  runtime.error(danger(`${context} failed: ${String(err)}`));
  if (shouldLogVerbose()) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stdout = (err as { stdout?: string })?.stdout;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stderr = (err as { stderr?: string })?.stderr;
    if (stdout?.trim()) {
      logDebug(`stdout: ${stdout.trim()}`);
    }
    if (stderr?.trim()) {
      logDebug(`stderr: ${stderr.trim()}`);
    }
  }
  runtime.exit(1);
  throw new Error("unreachable");
}

export { PortInUseError };
export type { PortListener, PortListenerKind, PortUsage, PortUsageStatus };
export { buildPortHints, classifyPortListener, formatPortDiagnostics } from "./ports-format.js";
export { inspectPortUsage } from "./ports-inspect.js";
