/*
 * AUTO ANNOTATION
 * File: extensions/tlon/src/monitor/processed-messages.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type ProcessedMessageTracker = {
  mark: (id?: string | null) => boolean;
  has: (id?: string | null) => boolean;
  size: () => number;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createProcessedMessageTracker(limit = 2000): ProcessedMessageTracker {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const seen = new Set<string>();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const order: string[] = [];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const mark = (id?: string | null) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const trimmed = id?.trim();
    if (!trimmed) {
      return true;
    }
    if (seen.has(trimmed)) {
      return false;
    }
    seen.add(trimmed);
    order.push(trimmed);
    if (order.length > limit) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const overflow = order.length - limit;
      for (let i = 0; i < overflow; i += 1) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const oldest = order.shift();
        if (oldest) {
          seen.delete(oldest);
        }
      }
    }
    return true;
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const has = (id?: string | null) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const trimmed = id?.trim();
    if (!trimmed) {
      return false;
    }
    return seen.has(trimmed);
  };

  return {
    mark,
    has,
    size: () => seen.size,
  };
}
