/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/actions/client.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { getMatrixRuntime } from "../../runtime.js";
import type { CoreConfig } from "../../types.js";
import { getActiveMatrixClient } from "../active-client.js";
import { createPreparedMatrixClient } from "../client-bootstrap.js";
import { isBunRuntime, resolveMatrixAuth, resolveSharedMatrixClient } from "../client.js";
import type { MatrixActionClient, MatrixActionClientOpts } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function ensureNodeRuntime() {
  if (isBunRuntime()) {
    throw new Error("Matrix support requires Node (bun runtime not supported)");
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveActionClient(
  opts: MatrixActionClientOpts = {},
): Promise<MatrixActionClient> {
  ensureNodeRuntime();
  if (opts.client) {
    return { client: opts.client, stopOnDone: false };
  }
  // Normalize accountId early to ensure consistent keying across all lookups
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accountId = normalizeAccountId(opts.accountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const active = getActiveMatrixClient(accountId);
  if (active) {
    return { client: active, stopOnDone: false };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const shouldShareClient = Boolean(process.env.OPENCLAW_GATEWAY_PORT);
  if (shouldShareClient) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = await resolveSharedMatrixClient({
      cfg: getMatrixRuntime().config.loadConfig() as CoreConfig,
      timeoutMs: opts.timeoutMs,
      accountId,
    });
    return { client, stopOnDone: false };
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const auth = await resolveMatrixAuth({
    cfg: getMatrixRuntime().config.loadConfig() as CoreConfig,
    accountId,
  });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const client = await createPreparedMatrixClient({
    auth,
    timeoutMs: opts.timeoutMs,
    accountId,
  });
  return { client, stopOnDone: true };
}
