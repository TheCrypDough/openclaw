/*
 * AUTO ANNOTATION
 * File: src/cli/browser-cli-resize.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { danger } from "../globals.js";
import { defaultRuntime } from "../runtime.js";
import { callBrowserResize, type BrowserParentOpts } from "./browser-cli-shared.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function runBrowserResizeWithOutput(params: {
  parent: BrowserParentOpts;
  profile?: string;
  width: number;
  height: number;
  targetId?: string;
  timeoutMs?: number;
  successMessage: string;
}): Promise<void> {
  const { width, height } = params;
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    defaultRuntime.error(danger("width and height must be numbers"));
    defaultRuntime.exit(1);
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const result = await callBrowserResize(
    params.parent,
    {
      profile: params.profile,
      width,
      height,
      targetId: params.targetId,
    },
    { timeoutMs: params.timeoutMs ?? 20000 },
  );

  if (params.parent?.json) {
    defaultRuntime.log(JSON.stringify(result, null, 2));
    return;
  }
  defaultRuntime.log(params.successMessage);
}
