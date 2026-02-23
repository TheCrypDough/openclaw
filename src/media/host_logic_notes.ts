/*
 * AUTO ANNOTATION
 * File: src/media/host.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import { formatCliCommand } from "../cli/command-format.js";
import { ensurePortAvailable, PortInUseError } from "../infra/ports.js";
import { getTailnetHostname } from "../infra/tailscale.js";
import { logInfo } from "../logger.js";
import { defaultRuntime, type RuntimeEnv } from "../runtime.js";
import { startMediaServer } from "./server.js";
import { saveMediaSource } from "./store.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_PORT = 42873;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const TTL_MS = 2 * 60 * 1000;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let mediaServer: import("http").Server | null = null;

export type HostedMedia = {
  url: string;
  id: string;
  size: number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function ensureMediaHosted(
  source: string,
  opts: {
    port?: number;
    startServer?: boolean;
    runtime?: RuntimeEnv;
  } = {},
): Promise<HostedMedia> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const port = opts.port ?? DEFAULT_PORT;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const runtime = opts.runtime ?? defaultRuntime;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const saved = await saveMediaSource(source);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hostname = await getTailnetHostname();

  // Decide whether we must start a media server.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const needsServerStart = await isPortFree(port);
  if (needsServerStart && !opts.startServer) {
    await fs.rm(saved.path).catch(() => {});
    throw new Error(
      `Media hosting requires the webhook/Funnel server. Start \`${formatCliCommand("openclaw webhook")}\`/\`${formatCliCommand("openclaw up")}\` or re-run with --serve-media.`,
    );
  }
  if (needsServerStart && opts.startServer) {
    if (!mediaServer) {
      mediaServer = await startMediaServer(port, TTL_MS, runtime);
      logInfo(
        `🦞 Started temporary media host on http://localhost:${port}/media/:id (TTL ${TTL_MS / 1000}s)`,
        runtime,
      );
      mediaServer.unref?.();
    }
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const url = `https://${hostname}/media/${saved.id}`;
  return { url, id: saved.id, size: saved.size };
}

async function isPortFree(port: number) {
  try {
    await ensurePortAvailable(port);
    return true;
  } catch (err) {
    if (err instanceof PortInUseError) {
      return false;
    }
    throw err;
  }
}
