/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/client-bootstrap.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createMatrixClient } from "./client.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MatrixClientBootstrapAuth = {
  homeserver: string;
  userId: string;
  accessToken: string;
  encryption?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MatrixCryptoPrepare = {
  prepare: (rooms?: string[]) => Promise<void>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type MatrixBootstrapClient = Awaited<ReturnType<typeof createMatrixClient>>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function createPreparedMatrixClient(opts: {
  auth: MatrixClientBootstrapAuth;
  timeoutMs?: number;
  accountId?: string;
}): Promise<MatrixBootstrapClient> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const client = await createMatrixClient({
    homeserver: opts.auth.homeserver,
    userId: opts.auth.userId,
    accessToken: opts.auth.accessToken,
    encryption: opts.auth.encryption,
    localTimeoutMs: opts.timeoutMs,
    accountId: opts.accountId,
  });
  if (opts.auth.encryption && client.crypto) {
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const joinedRooms = await client.getJoinedRooms();
      await (client.crypto as MatrixCryptoPrepare).prepare(joinedRooms);
    } catch {
      // Ignore crypto prep failures for one-off requests.
    }
  }
  await client.start();
  return client;
}
