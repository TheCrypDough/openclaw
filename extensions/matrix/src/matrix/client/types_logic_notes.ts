/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/client/types.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type MatrixResolvedConfig = {
  homeserver: string;
  userId: string;
  accessToken?: string;
  password?: string;
  deviceName?: string;
  initialSyncLimit?: number;
  encryption?: boolean;
};

/**
 * Authenticated Matrix configuration.
 * Note: deviceId is NOT included here because it's implicit in the accessToken.
 * The crypto storage assumes the device ID (and thus access token) does not change
 * between restarts. If the access token becomes invalid or crypto storage is lost,
 * both will need to be recreated together.
 */
export type MatrixAuth = {
  homeserver: string;
  userId: string;
  accessToken: string;
  deviceName?: string;
  initialSyncLimit?: number;
  encryption?: boolean;
};

export type MatrixStoragePaths = {
  rootDir: string;
  storagePath: string;
  cryptoPath: string;
  metaPath: string;
  accountKey: string;
  tokenHash: string;
};
