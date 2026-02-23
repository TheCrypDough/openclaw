/*
 * AUTO ANNOTATION
 * File: src/gateway/device-auth.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type DeviceAuthPayloadParams = {
  deviceId: string;
  clientId: string;
  clientMode: string;
  role: string;
  scopes: string[];
  signedAtMs: number;
  token?: string | null;
  nonce?: string | null;
  version?: "v1" | "v2";
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildDeviceAuthPayload(params: DeviceAuthPayloadParams): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const version = params.version ?? (params.nonce ? "v2" : "v1");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const scopes = params.scopes.join(",");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = params.token ?? "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base = [
    version,
    params.deviceId,
    params.clientId,
    params.clientMode,
    params.role,
    scopes,
    String(params.signedAtMs),
    token,
  ];
  if (version === "v2") {
    base.push(params.nonce ?? "");
  }
  return base.join("|");
}
