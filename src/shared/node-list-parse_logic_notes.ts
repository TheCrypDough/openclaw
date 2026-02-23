/*
 * AUTO ANNOTATION
 * File: src/shared/node-list-parse.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { NodeListNode, PairedNode, PairingList, PendingRequest } from "./node-list-types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parsePairingList(value: unknown): PairingList {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const obj = asRecord(value);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pending = Array.isArray(obj.pending) ? (obj.pending as PendingRequest[]) : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const paired = Array.isArray(obj.paired) ? (obj.paired as PairedNode[]) : [];
  return { pending, paired };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function parseNodeList(value: unknown): NodeListNode[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const obj = asRecord(value);
  return Array.isArray(obj.nodes) ? (obj.nodes as NodeListNode[]) : [];
}
