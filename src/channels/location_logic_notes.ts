/*
 * AUTO ANNOTATION
 * File: src/channels/location.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type LocationSource = "pin" | "place" | "live";

export type NormalizedLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  name?: string;
  address?: string;
  isLive?: boolean;
  source?: LocationSource;
  caption?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ResolvedLocation = NormalizedLocation & {
  source: LocationSource;
  isLive: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolveLocation(location: NormalizedLocation): ResolvedLocation {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const source =
    location.source ??
    (location.isLive ? "live" : location.name || location.address ? "place" : "pin");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const isLive = Boolean(location.isLive ?? source === "live");
  return { ...location, source, isLive };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatAccuracy(accuracy?: number): string {
  if (!Number.isFinite(accuracy)) {
    return "";
  }
  return ` ±${Math.round(accuracy ?? 0)}m`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatCoords(latitude: number, longitude: number): string {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatLocationText(location: NormalizedLocation): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const resolved = resolveLocation(location);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const coords = formatCoords(resolved.latitude, resolved.longitude);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const accuracy = formatAccuracy(resolved.accuracy);
  const caption = resolved.caption?.trim();
  let header = "";

  if (resolved.source === "live" || resolved.isLive) {
    header = `🛰 Live location: ${coords}${accuracy}`;
  } else if (resolved.name || resolved.address) {
    const label = [resolved.name, resolved.address].filter(Boolean).join(" — ");
    header = `📍 ${label} (${coords}${accuracy})`;
  } else {
    header = `📍 ${coords}${accuracy}`;
  }

  return caption ? `${header}\n${caption}` : header;
}

export function toLocationContext(location: NormalizedLocation): {
  LocationLat: number;
  LocationLon: number;
  LocationAccuracy?: number;
  LocationName?: string;
  LocationAddress?: string;
  LocationSource: LocationSource;
  LocationIsLive: boolean;
} {
  const resolved = resolveLocation(location);
  return {
    LocationLat: resolved.latitude,
    LocationLon: resolved.longitude,
    LocationAccuracy: resolved.accuracy,
    LocationName: resolved.name,
    LocationAddress: resolved.address,
    LocationSource: resolved.source,
    LocationIsLive: resolved.isLive,
  };
}
