/*
 * AUTO ANNOTATION
 * File: src/cli/outbound-send-deps.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OutboundSendDeps } from "../infra/outbound/deliver.js";
import {
  createOutboundSendDepsFromCliSource,
  type CliOutboundSendSource,
} from "./outbound-send-mapping.js";

export type CliDeps = Required<CliOutboundSendSource>;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createOutboundSendDeps(deps: CliDeps): OutboundSendDeps {
  return createOutboundSendDepsFromCliSource(deps);
}
