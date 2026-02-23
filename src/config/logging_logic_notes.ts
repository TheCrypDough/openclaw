/*
 * AUTO ANNOTATION
 * File: src/config/logging.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { RuntimeEnv } from "../runtime.js";
import { displayPath } from "../utils.js";
import { CONFIG_PATH } from "./paths.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type LogConfigUpdatedOptions = {
  path?: string;
  suffix?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatConfigPath(path: string = CONFIG_PATH): string {
  return displayPath(path);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function logConfigUpdated(runtime: RuntimeEnv, opts: LogConfigUpdatedOptions = {}): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const path = formatConfigPath(opts.path ?? CONFIG_PATH);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const suffix = opts.suffix ? ` ${opts.suffix}` : "";
  runtime.log(`Updated ${path}${suffix}`);
}
