/*
 * AUTO ANNOTATION
 * File: src/infra/pairing-files.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";

export { createAsyncLock, readJsonFile, writeJsonAtomic } from "./json-files.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolvePairingPaths(baseDir: string | undefined, subdir: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const root = baseDir ?? resolveStateDir();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = path.join(root, subdir);
  return {
    dir,
    pendingPath: path.join(dir, "pending.json"),
    pairedPath: path.join(dir, "paired.json"),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function pruneExpiredPending<T extends { ts: number }>(
  pendingById: Record<string, T>,
  nowMs: number,
  ttlMs: number,
) {
  for (const [id, req] of Object.entries(pendingById)) {
    if (nowMs - req.ts > ttlMs) {
      delete pendingById[id];
    }
  }
}

export type PendingPairingRequestResult<TPending> = {
  status: "pending";
  request: TPending;
  created: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function upsertPendingPairingRequest<TPending extends { requestId: string }>(params: {
  pendingById: Record<string, TPending>;
  isExisting: (pending: TPending) => boolean;
  createRequest: (isRepair: boolean) => TPending;
  isRepair: boolean;
  persist: () => Promise<void>;
}): Promise<PendingPairingRequestResult<TPending>> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const existing = Object.values(params.pendingById).find(params.isExisting);
  if (existing) {
    return { status: "pending", request: existing, created: false };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const request = params.createRequest(params.isRepair);
  params.pendingById[request.requestId] = request;
  await params.persist();
  return { status: "pending", request, created: true };
}
