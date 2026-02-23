/*
 * AUTO ANNOTATION
 * File: src/web/auto-reply/loggers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { createSubsystemLogger } from "../../logging/subsystem.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const whatsappLog = createSubsystemLogger("gateway/channels/whatsapp");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const whatsappInboundLog = whatsappLog.child("inbound");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const whatsappOutboundLog = whatsappLog.child("outbound");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const whatsappHeartbeatLog = whatsappLog.child("heartbeat");
