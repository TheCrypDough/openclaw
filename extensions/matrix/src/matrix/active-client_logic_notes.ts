/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/active-client.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MatrixClient } from "@vector-im/matrix-bot-sdk";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";

// Support multiple active clients for multi-account
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const activeClients = new Map<string, MatrixClient>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setActiveMatrixClient(
  client: MatrixClient | null,
  accountId?: string | null,
): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = normalizeAccountId(accountId);
  if (client) {
    activeClients.set(key, client);
  } else {
    activeClients.delete(key);
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getActiveMatrixClient(accountId?: string | null): MatrixClient | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const key = normalizeAccountId(accountId);
  return activeClients.get(key) ?? null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getAnyActiveMatrixClient(): MatrixClient | null {
  // Return any available client (for backward compatibility)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const first = activeClients.values().next();
  return first.done ? null : first.value;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function clearAllActiveMatrixClients(): void {
  activeClients.clear();
}
