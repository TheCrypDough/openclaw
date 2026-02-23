/*
 * AUTO ANNOTATION
 * File: src/plugins/logger.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { PluginLogger } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type LoggerLike = {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  debug?: (message: string) => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createPluginLoaderLogger(logger: LoggerLike): PluginLogger {
  return {
    info: (msg) => logger.info(msg),
    warn: (msg) => logger.warn(msg),
    error: (msg) => logger.error(msg),
    debug: (msg) => logger.debug?.(msg),
  };
}
