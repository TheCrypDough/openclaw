/*
 * AUTO ANNOTATION
 * File: src/browser/bridge-auth-registry.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type BridgeAuth = {
  token?: string;
  password?: string;
};

// In-process registry for loopback-only bridge servers that require auth, but
// are addressed via dynamic ephemeral ports (e.g. sandbox browser bridge).
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const authByPort = new Map<number, BridgeAuth>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function setBridgeAuthForPort(port: number, auth: BridgeAuth): void {
  if (!Number.isFinite(port) || port <= 0) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = typeof auth.token === "string" ? auth.token.trim() : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const password = typeof auth.password === "string" ? auth.password.trim() : "";
  authByPort.set(port, {
    token: token || undefined,
    password: password || undefined,
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getBridgeAuthForPort(port: number): BridgeAuth | undefined {
  if (!Number.isFinite(port) || port <= 0) {
    return undefined;
  }
  return authByPort.get(port);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function deleteBridgeAuthForPort(port: number): void {
  if (!Number.isFinite(port) || port <= 0) {
    return;
  }
  authByPort.delete(port);
}
