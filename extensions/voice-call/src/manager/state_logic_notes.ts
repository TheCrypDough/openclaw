/*
 * AUTO ANNOTATION
 * File: extensions/voice-call/src/manager/state.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { TerminalStates, type CallRecord, type CallState, type TranscriptEntry } from "../types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ConversationStates = new Set<CallState>(["speaking", "listening"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const StateOrder: readonly CallState[] = [
  "initiated",
  "ringing",
  "answered",
  "active",
  "speaking",
  "listening",
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function transitionState(call: CallRecord, newState: CallState): void {
  // No-op for same state or already terminal.
  if (call.state === newState || TerminalStates.has(call.state)) {
    return;
  }

  // Terminal states can always be reached from non-terminal.
  if (TerminalStates.has(newState)) {
    call.state = newState;
    return;
  }

  // Allow cycling between speaking and listening (multi-turn conversations).
  if (ConversationStates.has(call.state) && ConversationStates.has(newState)) {
    call.state = newState;
    return;
  }

  // Only allow forward transitions in state order.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const currentIndex = StateOrder.indexOf(call.state);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const newIndex = StateOrder.indexOf(newState);
  if (newIndex > currentIndex) {
    call.state = newState;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function addTranscriptEntry(call: CallRecord, speaker: "bot" | "user", text: string): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entry: TranscriptEntry = {
    timestamp: Date.now(),
    speaker,
    text,
    isFinal: true,
  };
  call.transcript.push(entry);
}
