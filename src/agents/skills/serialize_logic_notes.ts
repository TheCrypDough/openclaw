/*
 * AUTO ANNOTATION
 * File: src/agents/skills/serialize.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SKILLS_SYNC_QUEUE = new Map<string, Promise<unknown>>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function serializeByKey<T>(key: string, task: () => Promise<T>) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prev = SKILLS_SYNC_QUEUE.get(key) ?? Promise.resolve();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const next = prev.then(task, task);
  SKILLS_SYNC_QUEUE.set(key, next);
  try {
    return await next;
  } finally {
    if (SKILLS_SYNC_QUEUE.get(key) === next) {
      SKILLS_SYNC_QUEUE.delete(key);
    }
  }
}
