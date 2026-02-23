/*
 * AUTO ANNOTATION
 * File: src/sessions/transcript-events.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SessionTranscriptUpdate = {
  sessionFile: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SessionTranscriptListener = (update: SessionTranscriptUpdate) => void;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const SESSION_TRANSCRIPT_LISTENERS = new Set<SessionTranscriptListener>();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function onSessionTranscriptUpdate(listener: SessionTranscriptListener): () => void {
  SESSION_TRANSCRIPT_LISTENERS.add(listener);
  return () => {
    SESSION_TRANSCRIPT_LISTENERS.delete(listener);
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function emitSessionTranscriptUpdate(sessionFile: string): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = sessionFile.trim();
  if (!trimmed) {
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const update = { sessionFile: trimmed };
  for (const listener of SESSION_TRANSCRIPT_LISTENERS) {
    listener(update);
  }
}
