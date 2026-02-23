/*
 * AUTO ANNOTATION
 * File: src/imessage/monitor/runtime.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createNonExitingRuntime, type RuntimeEnv } from "../../runtime.js";
import { normalizeStringEntries } from "../../shared/string-normalization.js";
import type { MonitorIMessageOpts } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveRuntime(opts: MonitorIMessageOpts): RuntimeEnv {
  return opts.runtime ?? createNonExitingRuntime();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeAllowList(list?: Array<string | number>) {
  return normalizeStringEntries(list);
}
