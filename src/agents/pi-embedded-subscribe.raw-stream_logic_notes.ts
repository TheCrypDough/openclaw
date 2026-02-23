/*
 * AUTO ANNOTATION
 * File: src/agents/pi-embedded-subscribe.raw-stream.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";
import { isTruthyEnvValue } from "../infra/env.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RAW_STREAM_ENABLED = isTruthyEnvValue(process.env.OPENCLAW_RAW_STREAM);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const RAW_STREAM_PATH =
  process.env.OPENCLAW_RAW_STREAM_PATH?.trim() ||
  path.join(resolveStateDir(), "logs", "raw-stream.jsonl");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let rawStreamReady = false;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function appendRawStream(payload: Record<string, unknown>) {
  if (!RAW_STREAM_ENABLED) {
    return;
  }
  if (!rawStreamReady) {
    rawStreamReady = true;
    try {
      fs.mkdirSync(path.dirname(RAW_STREAM_PATH), { recursive: true });
    } catch {
      // ignore raw stream mkdir failures
    }
  }
  try {
    void fs.promises.appendFile(RAW_STREAM_PATH, `${JSON.stringify(payload)}\n`);
  } catch {
    // ignore raw stream write failures
  }
}
