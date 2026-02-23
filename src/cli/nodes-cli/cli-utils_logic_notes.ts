/*
 * AUTO ANNOTATION
 * File: src/cli/nodes-cli/cli-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { defaultRuntime } from "../../runtime.js";
import { isRich, theme } from "../../terminal/theme.js";
import { runCommandWithRuntime } from "../cli-utils.js";
import { unauthorizedHintForMessage } from "./rpc.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getNodesTheme() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rich = isRich();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const color = (fn: (value: string) => string) => (value: string) => (rich ? fn(value) : value);
  return {
    rich,
    heading: color(theme.heading),
    ok: color(theme.success),
    warn: color(theme.warn),
    muted: color(theme.muted),
    error: color(theme.error),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function runNodesCommand(label: string, action: () => Promise<void>) {
  return runCommandWithRuntime(defaultRuntime, action, (err) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = String(err);
    const { error, warn } = getNodesTheme();
    defaultRuntime.error(error(`nodes ${label} failed: ${message}`));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const hint = unauthorizedHintForMessage(message);
    if (hint) {
      defaultRuntime.error(warn(hint));
    }
    defaultRuntime.exit(1);
  });
}
