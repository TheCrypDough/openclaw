/*
 * AUTO ANNOTATION
 * File: src/infra/ports-types.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type PortListener = {
  pid?: number;
  command?: string;
  commandLine?: string;
  user?: string;
  address?: string;
};

export type PortUsageStatus = "free" | "busy" | "unknown";

export type PortUsage = {
  port: number;
  status: PortUsageStatus;
  listeners: PortListener[];
  hints: string[];
  detail?: string;
  errors?: string[];
};

export type PortListenerKind = "gateway" | "ssh" | "unknown";
