/*
 * AUTO ANNOTATION
 * File: src/gateway/protocol/schema/snapshot.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Type } from "@sinclair/typebox";
import { NonEmptyString } from "./primitives.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const PresenceEntrySchema = Type.Object(
  {
    host: Type.Optional(NonEmptyString),
    ip: Type.Optional(NonEmptyString),
    version: Type.Optional(NonEmptyString),
    platform: Type.Optional(NonEmptyString),
    deviceFamily: Type.Optional(NonEmptyString),
    modelIdentifier: Type.Optional(NonEmptyString),
    mode: Type.Optional(NonEmptyString),
    lastInputSeconds: Type.Optional(Type.Integer({ minimum: 0 })),
    reason: Type.Optional(NonEmptyString),
    tags: Type.Optional(Type.Array(NonEmptyString)),
    text: Type.Optional(Type.String()),
    ts: Type.Integer({ minimum: 0 }),
    deviceId: Type.Optional(NonEmptyString),
    roles: Type.Optional(Type.Array(NonEmptyString)),
    scopes: Type.Optional(Type.Array(NonEmptyString)),
    instanceId: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const HealthSnapshotSchema = Type.Any();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SessionDefaultsSchema = Type.Object(
  {
    defaultAgentId: NonEmptyString,
    mainKey: NonEmptyString,
    mainSessionKey: NonEmptyString,
    scope: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const StateVersionSchema = Type.Object(
  {
    presence: Type.Integer({ minimum: 0 }),
    health: Type.Integer({ minimum: 0 }),
  },
  { additionalProperties: false },
);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const SnapshotSchema = Type.Object(
  {
    presence: Type.Array(PresenceEntrySchema),
    health: HealthSnapshotSchema,
    stateVersion: StateVersionSchema,
    uptimeMs: Type.Integer({ minimum: 0 }),
    configPath: Type.Optional(NonEmptyString),
    stateDir: Type.Optional(NonEmptyString),
    sessionDefaults: Type.Optional(SessionDefaultsSchema),
    authMode: Type.Optional(
      Type.Union([
        Type.Literal("none"),
        Type.Literal("token"),
        Type.Literal("password"),
        Type.Literal("trusted-proxy"),
      ]),
    ),
    updateAvailable: Type.Optional(
      Type.Object({
        currentVersion: NonEmptyString,
        latestVersion: NonEmptyString,
        channel: NonEmptyString,
      }),
    ),
  },
  { additionalProperties: false },
);
