/*
 * AUTO ANNOTATION
 * File: src/gateway/server-methods/validation.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ErrorObject } from "ajv";
import { ErrorCodes, errorShape, formatValidationErrors } from "../protocol/index.js";
import type { RespondFn } from "./types.js";

export type Validator<T> = ((params: unknown) => params is T) & {
  errors?: ErrorObject[] | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function assertValidParams<T>(
  params: unknown,
  validate: Validator<T>,
  method: string,
  respond: RespondFn,
): params is T {
  if (validate(params)) {
    return true;
  }
  respond(
    false,
    undefined,
    errorShape(
      ErrorCodes.INVALID_REQUEST,
      `invalid ${method} params: ${formatValidationErrors(validate.errors)}`,
    ),
  );
  return false;
}
