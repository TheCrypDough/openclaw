/*
 * AUTO ANNOTATION
 * File: src/gateway/protocol/schema/wizard.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Type } from "@sinclair/typebox";
import { NonEmptyString } from "./primitives.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const WizardRunStatusSchema = Type.Union([
  Type.Literal("running"),
  Type.Literal("done"),
  Type.Literal("cancelled"),
  Type.Literal("error"),
]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const WizardStartParamsSchema = Type.Object(
  {
    mode: Type.Optional(Type.Union([Type.Literal("local"), Type.Literal("remote")])),
    workspace: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const WizardAnswerSchema = Type.Object(
  {
    stepId: NonEmptyString,
    value: Type.Optional(Type.Unknown()),
  },
  { additionalProperties: false },
);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const WizardNextParamsSchema = Type.Object(
  {
    sessionId: NonEmptyString,
    answer: Type.Optional(WizardAnswerSchema),
  },
  { additionalProperties: false },
);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const WizardSessionIdParamsSchema = Type.Object(
  {
    sessionId: NonEmptyString,
  },
  { additionalProperties: false },
);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const WizardCancelParamsSchema = WizardSessionIdParamsSchema;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const WizardStatusParamsSchema = WizardSessionIdParamsSchema;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const WizardStepOptionSchema = Type.Object(
  {
    value: Type.Unknown(),
    label: NonEmptyString,
    hint: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const WizardStepSchema = Type.Object(
  {
    id: NonEmptyString,
    type: Type.Union([
      Type.Literal("note"),
      Type.Literal("select"),
      Type.Literal("text"),
      Type.Literal("confirm"),
      Type.Literal("multiselect"),
      Type.Literal("progress"),
      Type.Literal("action"),
    ]),
    title: Type.Optional(Type.String()),
    message: Type.Optional(Type.String()),
    options: Type.Optional(Type.Array(WizardStepOptionSchema)),
    initialValue: Type.Optional(Type.Unknown()),
    placeholder: Type.Optional(Type.String()),
    sensitive: Type.Optional(Type.Boolean()),
    executor: Type.Optional(Type.Union([Type.Literal("gateway"), Type.Literal("client")])),
  },
  { additionalProperties: false },
);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const WizardResultFields = {
  done: Type.Boolean(),
  step: Type.Optional(WizardStepSchema),
  status: Type.Optional(WizardRunStatusSchema),
  error: Type.Optional(Type.String()),
};

export const WizardNextResultSchema = Type.Object(WizardResultFields, {
  additionalProperties: false,
});

export const WizardStartResultSchema = Type.Object(
  {
    sessionId: NonEmptyString,
    ...WizardResultFields,
  },
  { additionalProperties: false },
);

export const WizardStatusResultSchema = Type.Object(
  {
    status: WizardRunStatusSchema,
    error: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);
