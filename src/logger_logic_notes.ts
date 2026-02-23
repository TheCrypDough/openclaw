/*
 * AUTO ANNOTATION
 * File: src/logger.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { danger, info, logVerboseConsole, success, warn } from "./globals.js";
import { getLogger } from "./logging/logger.js";
import { createSubsystemLogger } from "./logging/subsystem.js";
import { defaultRuntime, type RuntimeEnv } from "./runtime.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const subsystemPrefixRe = /^([a-z][a-z0-9-]{1,20}):\s+(.*)$/i;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function splitSubsystem(message: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = message.match(subsystemPrefixRe);
  if (!match) {
    return null;
  }
  const [, subsystem, rest] = match;
  return { subsystem, rest };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function logInfo(message: string, runtime: RuntimeEnv = defaultRuntime) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = runtime === defaultRuntime ? splitSubsystem(message) : null;
  if (parsed) {
    createSubsystemLogger(parsed.subsystem).info(parsed.rest);
    return;
  }
  runtime.log(info(message));
  getLogger().info(message);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function logWarn(message: string, runtime: RuntimeEnv = defaultRuntime) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = runtime === defaultRuntime ? splitSubsystem(message) : null;
  if (parsed) {
    createSubsystemLogger(parsed.subsystem).warn(parsed.rest);
    return;
  }
  runtime.log(warn(message));
  getLogger().warn(message);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function logSuccess(message: string, runtime: RuntimeEnv = defaultRuntime) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const parsed = runtime === defaultRuntime ? splitSubsystem(message) : null;
  if (parsed) {
    createSubsystemLogger(parsed.subsystem).info(parsed.rest);
    return;
  }
  runtime.log(success(message));
  getLogger().info(message);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function logError(message: string, runtime: RuntimeEnv = defaultRuntime) {
  const parsed = runtime === defaultRuntime ? splitSubsystem(message) : null;
  if (parsed) {
    createSubsystemLogger(parsed.subsystem).error(parsed.rest);
    return;
  }
  runtime.error(danger(message));
  getLogger().error(message);
}

export function logDebug(message: string) {
  // Always emit to file logger (level-filtered); console only when verbose.
  getLogger().debug(message);
  logVerboseConsole(message);
}
