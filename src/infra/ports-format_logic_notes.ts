/*
 * AUTO ANNOTATION
 * File: src/infra/ports-format.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { formatCliCommand } from "../cli/command-format.js";
import type { PortListener, PortListenerKind, PortUsage } from "./ports-types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function classifyPortListener(listener: PortListener, port: number): PortListenerKind {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = `${listener.commandLine ?? ""} ${listener.command ?? ""}`.trim().toLowerCase();
  if (raw.includes("openclaw")) {
    return "gateway";
  }
  if (raw.includes("ssh")) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const portToken = String(port);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tunnelPattern = new RegExp(
      `-(l|r)\\s*${portToken}\\b|-(l|r)${portToken}\\b|:${portToken}\\b`,
    );
    if (!raw || tunnelPattern.test(raw)) {
      return "ssh";
    }
    return "ssh";
  }
  return "unknown";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildPortHints(listeners: PortListener[], port: number): string[] {
  if (listeners.length === 0) {
    return [];
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const kinds = new Set(listeners.map((listener) => classifyPortListener(listener, port)));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hints: string[] = [];
  if (kinds.has("gateway")) {
    hints.push(
      `Gateway already running locally. Stop it (${formatCliCommand("openclaw gateway stop")}) or use a different port.`,
    );
  }
  if (kinds.has("ssh")) {
    hints.push(
      "SSH tunnel already bound to this port. Close the tunnel or use a different local port in -L.",
    );
  }
  if (kinds.has("unknown")) {
    hints.push("Another process is listening on this port.");
  }
  if (listeners.length > 1) {
    hints.push(
      "Multiple listeners detected; ensure only one gateway/tunnel per port unless intentionally running isolated profiles.",
    );
  }
  return hints;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function formatPortListener(listener: PortListener): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pid = listener.pid ? `pid ${listener.pid}` : "pid ?";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const user = listener.user ? ` ${listener.user}` : "";
  const command = listener.commandLine || listener.command || "unknown";
  const address = listener.address ? ` (${listener.address})` : "";
  return `${pid}${user}: ${command}${address}`;
}

export function formatPortDiagnostics(diagnostics: PortUsage): string[] {
  if (diagnostics.status !== "busy") {
    return [`Port ${diagnostics.port} is free.`];
  }
  const lines = [`Port ${diagnostics.port} is already in use.`];
  for (const listener of diagnostics.listeners) {
    lines.push(`- ${formatPortListener(listener)}`);
  }
  for (const hint of diagnostics.hints) {
    lines.push(`- ${hint}`);
  }
  return lines;
}
