/*
 * AUTO ANNOTATION
 * File: src/acp/index.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export { serveAcpGateway } from "./server.js";
export { createInMemorySessionStore } from "./session.js";
export type { AcpSessionStore } from "./session.js";
export type { AcpServerOptions } from "./types.js";
