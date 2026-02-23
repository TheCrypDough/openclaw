/*
 * AUTO ANNOTATION
 * File: src/cli/daemon-cli/status.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { defaultRuntime } from "../../runtime.js";
import { colorize, isRich, theme } from "../../terminal/theme.js";
import { gatherDaemonStatus } from "./status.gather.js";
import { printDaemonStatus } from "./status.print.js";
import type { DaemonStatusOptions } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runDaemonStatus(opts: DaemonStatusOptions) {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const status = await gatherDaemonStatus({
      rpc: opts.rpc,
      probe: Boolean(opts.probe),
      deep: Boolean(opts.deep),
    });
    printDaemonStatus(status, { json: Boolean(opts.json) });
  } catch (err) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rich = isRich();
    defaultRuntime.error(colorize(rich, theme.error, `Gateway status failed: ${String(err)}`));
    defaultRuntime.exit(1);
  }
}
