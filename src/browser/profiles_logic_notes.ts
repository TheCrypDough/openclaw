/*
 * AUTO ANNOTATION
 * File: src/browser/profiles.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/**
 * CDP port allocation for browser profiles.
 *
 * Default port range: 18800-18899 (100 profiles max)
 * Ports are allocated once at profile creation and persisted in config.
 * Multi-instance: callers may pass an explicit range to avoid collisions.
 *
 * Reserved ports (do not use for CDP):
 *   18789 - Gateway WebSocket
 *   18790 - Bridge
 *   18791 - Browser control server
 *   18792-18799 - Reserved for future one-off services (canvas at 18793)
 */

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CDP_PORT_RANGE_START = 18800;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const CDP_PORT_RANGE_END = 18899;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const PROFILE_NAME_REGEX = /^[a-z0-9][a-z0-9-]*$/;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isValidProfileName(name: string): boolean {
  if (!name || name.length > 64) {
    return false;
  }
  return PROFILE_NAME_REGEX.test(name);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function allocateCdpPort(
  usedPorts: Set<number>,
  range?: { start: number; end: number },
): number | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const start = range?.start ?? CDP_PORT_RANGE_START;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const end = range?.end ?? CDP_PORT_RANGE_END;
  if (!Number.isFinite(start) || !Number.isFinite(end) || start <= 0 || end <= 0) {
    return null;
  }
  if (start > end) {
    return null;
  }
  for (let port = start; port <= end; port++) {
    if (!usedPorts.has(port)) {
      return port;
    }
  }
  return null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getUsedPorts(
  profiles: Record<string, { cdpPort?: number; cdpUrl?: string }> | undefined,
): Set<number> {
  if (!profiles) {
    return new Set();
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const used = new Set<number>();
  for (const profile of Object.values(profiles)) {
    if (typeof profile.cdpPort === "number") {
      used.add(profile.cdpPort);
      continue;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rawUrl = profile.cdpUrl?.trim();
    if (!rawUrl) {
      continue;
    }
    try {
      const parsed = new URL(rawUrl);
      const port =
        parsed.port && Number.parseInt(parsed.port, 10) > 0
          ? Number.parseInt(parsed.port, 10)
          : parsed.protocol === "https:"
            ? 443
            : 80;
      if (!Number.isNaN(port) && port > 0 && port <= 65535) {
        used.add(port);
      }
    } catch {
      // ignore invalid URLs
    }
  }
  return used;
}

export const PROFILE_COLORS = [
  "#FF4500", // Orange-red (openclaw default)
  "#0066CC", // Blue
  "#00AA00", // Green
  "#9933FF", // Purple
  "#FF6699", // Pink
  "#00CCCC", // Cyan
  "#FF9900", // Orange
  "#6666FF", // Indigo
  "#CC3366", // Magenta
  "#339966", // Teal
];

export function allocateColor(usedColors: Set<string>): string {
  // Find first unused color from palette
  for (const color of PROFILE_COLORS) {
    if (!usedColors.has(color.toUpperCase())) {
      return color;
    }
  }
  // All colors used, cycle based on count
  const index = usedColors.size % PROFILE_COLORS.length;
  return PROFILE_COLORS[index] ?? PROFILE_COLORS[0];
}

export function getUsedColors(
  profiles: Record<string, { color: string }> | undefined,
): Set<string> {
  if (!profiles) {
    return new Set();
  }
  return new Set(Object.values(profiles).map((p) => p.color.toUpperCase()));
}
