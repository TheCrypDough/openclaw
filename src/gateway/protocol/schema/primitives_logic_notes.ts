/*
 * AUTO ANNOTATION
 * File: src/gateway/protocol/schema/primitives.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Type } from "@sinclair/typebox";
import { SESSION_LABEL_MAX_LENGTH } from "../../../sessions/session-label.js";
import { GATEWAY_CLIENT_IDS, GATEWAY_CLIENT_MODES } from "../client-info.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const NonEmptyString = Type.String({ minLength: 1 });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SessionLabelString = Type.String({
  minLength: 1,
  maxLength: SESSION_LABEL_MAX_LENGTH,
});

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const GatewayClientIdSchema = Type.Union(
  Object.values(GATEWAY_CLIENT_IDS).map((value) => Type.Literal(value)),
);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const GatewayClientModeSchema = Type.Union(
  Object.values(GATEWAY_CLIENT_MODES).map((value) => Type.Literal(value)),
);
