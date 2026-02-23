/*
 * AUTO ANNOTATION
 * File: src/hooks/gmail-watcher-lifecycle.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../config/config.js";
import { isTruthyEnvValue } from "../infra/env.js";
import { startGmailWatcher } from "./gmail-watcher.js";

export type GMailWatcherLog = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function startGmailWatcherWithLogs(params: {
  cfg: OpenClawConfig;
  log: GMailWatcherLog;
  onSkipped?: () => void;
}) {
  if (isTruthyEnvValue(process.env.OPENCLAW_SKIP_GMAIL_WATCHER)) {
    params.onSkipped?.();
    return;
  }

  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const gmailResult = await startGmailWatcher(params.cfg);
    if (gmailResult.started) {
      params.log.info("gmail watcher started");
      return;
    }
    if (
      gmailResult.reason &&
      gmailResult.reason !== "hooks not enabled" &&
      gmailResult.reason !== "no gmail account configured"
    ) {
      params.log.warn(`gmail watcher not started: ${gmailResult.reason}`);
    }
  } catch (err) {
    params.log.error(`gmail watcher failed to start: ${String(err)}`);
  }
}
