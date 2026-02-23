/*
 * AUTO ANNOTATION
 * File: src/terminal/progress-line.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
let activeStream: NodeJS.WriteStream | null = null;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerActiveProgressLine(stream: NodeJS.WriteStream): void {
  if (!stream.isTTY) {
    return;
  }
  activeStream = stream;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function clearActiveProgressLine(): void {
  if (!activeStream?.isTTY) {
    return;
  }
  activeStream.write("\r\x1b[2K");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function unregisterActiveProgressLine(stream?: NodeJS.WriteStream): void {
  if (!activeStream) {
    return;
  }
  if (stream && activeStream !== stream) {
    return;
  }
  activeStream = null;
}
