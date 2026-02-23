/*
 * AUTO ANNOTATION
 * File: src/channels/logging.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type LogFn = (message: string) => void;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function logInboundDrop(params: {
  log: LogFn;
  channel: string;
  reason: string;
  target?: string;
}): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const target = params.target ? ` target=${params.target}` : "";
  params.log(`${params.channel}: drop ${params.reason}${target}`);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function logTypingFailure(params: {
  log: LogFn;
  channel: string;
  target?: string;
  action?: "start" | "stop";
  error: unknown;
}): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const target = params.target ? ` target=${params.target}` : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const action = params.action ? ` action=${params.action}` : "";
  params.log(`${params.channel} typing${action} failed${target}: ${String(params.error)}`);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function logAckFailure(params: {
  log: LogFn;
  channel: string;
  target?: string;
  error: unknown;
}): void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const target = params.target ? ` target=${params.target}` : "";
  params.log(`${params.channel} ack cleanup failed${target}: ${String(params.error)}`);
}
