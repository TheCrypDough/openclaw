/*
 * AUTO ANNOTATION
 * File: src/gateway/protocol/schema/push.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Type } from "@sinclair/typebox";
import { NonEmptyString } from "./primitives.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ApnsEnvironmentSchema = Type.String({ enum: ["sandbox", "production"] });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const PushTestParamsSchema = Type.Object(
  {
    nodeId: NonEmptyString,
    title: Type.Optional(Type.String()),
    body: Type.Optional(Type.String()),
    environment: Type.Optional(ApnsEnvironmentSchema),
  },
  { additionalProperties: false },
);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const PushTestResultSchema = Type.Object(
  {
    ok: Type.Boolean(),
    status: Type.Integer(),
    apnsId: Type.Optional(Type.String()),
    reason: Type.Optional(Type.String()),
    tokenSuffix: Type.String(),
    topic: Type.String(),
    environment: ApnsEnvironmentSchema,
  },
  { additionalProperties: false },
);
