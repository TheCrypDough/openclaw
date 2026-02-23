/*
 * AUTO ANNOTATION
 * File: src/commands/daemon-install-runtime-warning.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { renderSystemNodeWarning, resolveSystemNodeInfo } from "../daemon/runtime-paths.js";

export type DaemonInstallWarnFn = (message: string, title?: string) => void;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function emitNodeRuntimeWarning(params: {
  env: Record<string, string | undefined>;
  runtime: string;
  nodeProgram?: string;
  warn?: DaemonInstallWarnFn;
  title: string;
}): Promise<void> {
  if (params.runtime !== "node") {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const systemNode = await resolveSystemNodeInfo({ env: params.env });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const warning = renderSystemNodeWarning(systemNode, params.nodeProgram);
  if (warning) {
    params.warn?.(warning, params.title);
  }
}
