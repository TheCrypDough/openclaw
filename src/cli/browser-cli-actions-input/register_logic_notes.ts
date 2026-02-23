/*
 * AUTO ANNOTATION
 * File: src/cli/browser-cli-actions-input/register.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Command } from "commander";
import type { BrowserParentOpts } from "../browser-cli-shared.js";
import { registerBrowserElementCommands } from "./register.element.js";
import { registerBrowserFilesAndDownloadsCommands } from "./register.files-downloads.js";
import { registerBrowserFormWaitEvalCommands } from "./register.form-wait-eval.js";
import { registerBrowserNavigationCommands } from "./register.navigation.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerBrowserActionInputCommands(
  browser: Command,
  parentOpts: (cmd: Command) => BrowserParentOpts,
) {
  registerBrowserNavigationCommands(browser, parentOpts);
  registerBrowserElementCommands(browser, parentOpts);
  registerBrowserFilesAndDownloadsCommands(browser, parentOpts);
  registerBrowserFormWaitEvalCommands(browser, parentOpts);
}
