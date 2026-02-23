/*
 * AUTO ANNOTATION
 * File: src/hooks/bundled/command-logger/handler.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * Example hook handler: Log all commands to a file
 *
 * This handler demonstrates how to create a hook that logs all command events
 * to a centralized log file for audit/debugging purposes.
 *
 * To enable this handler, add it to your config:
 *
 * ```json
 * {
 *   "hooks": {
 *     "internal": {
 *       "enabled": true,
 *       "handlers": [
 *         {
 *           "event": "command",
 *           "module": "./hooks/handlers/command-logger.ts"
 *         }
 *       ]
 *     }
 *   }
 * }
 * ```
 */

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { resolveStateDir } from "../../../config/paths.js";
import { createSubsystemLogger } from "../../../logging/subsystem.js";
import type { HookHandler } from "../../hooks.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const log = createSubsystemLogger("command-logger");

/**
 * Log all command events to a file
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const logCommand: HookHandler = async (event) => {
  // Only trigger on command events
  if (event.type !== "command") {
    return;
  }

  try {
    // Create log directory
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stateDir = resolveStateDir(process.env, os.homedir);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const logDir = path.join(stateDir, "logs");
    await fs.mkdir(logDir, { recursive: true });

    // Append to command log file
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const logFile = path.join(logDir, "commands.log");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const logLine =
      JSON.stringify({
        timestamp: event.timestamp.toISOString(),
        action: event.action,
        sessionKey: event.sessionKey,
        senderId: event.context.senderId ?? "unknown",
        source: event.context.commandSource ?? "unknown",
      }) + "\n";

    await fs.appendFile(logFile, logLine, "utf-8");
  } catch (err) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = err instanceof Error ? err.message : String(err);
    log.error(`Failed to log command: ${message}`);
  }
};

export default logCommand;
