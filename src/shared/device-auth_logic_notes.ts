/*
 * AUTO ANNOTATION
 * File: src/shared/device-auth.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type DeviceAuthEntry = {
  token: string;
  role: string;
  scopes: string[];
  updatedAtMs: number;
};

export type DeviceAuthStore = {
  version: 1;
  deviceId: string;
  tokens: Record<string, DeviceAuthEntry>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeDeviceAuthRole(role: string): string {
  return role.trim();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeDeviceAuthScopes(scopes: string[] | undefined): string[] {
  if (!Array.isArray(scopes)) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const out = new Set<string>();
  for (const scope of scopes) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const trimmed = scope.trim();
    if (trimmed) {
      out.add(trimmed);
    }
  }
  return [...out].toSorted();
}
