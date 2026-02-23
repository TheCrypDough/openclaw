/*
 * AUTO ANNOTATION
 * File: src/infra/map-size.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function pruneMapToMaxSize<K, V>(map: Map<K, V>, maxSize: number): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const limit = Math.max(0, Math.floor(maxSize));
  if (limit <= 0) {
    map.clear();
    return;
  }

  while (map.size > limit) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const oldest = map.keys().next();
    if (oldest.done) {
      break;
    }
    map.delete(oldest.value);
  }
}
