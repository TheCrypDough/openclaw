/*
 * AUTO ANNOTATION
 * File: src/gateway/server-methods/nodes.helpers.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ErrorObject } from "ajv";
import { ErrorCodes, errorShape, formatValidationErrors } from "../protocol/index.js";
import { formatForLog } from "../ws-log.js";
import type { RespondFn } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ValidatorFn = ((value: unknown) => boolean) & {
  errors?: ErrorObject[] | null;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function respondInvalidParams(params: {
  respond: RespondFn;
  method: string;
  validator: ValidatorFn;
}) {
  params.respond(
    false,
    undefined,
    errorShape(
      ErrorCodes.INVALID_REQUEST,
      `invalid ${params.method} params: ${formatValidationErrors(params.validator.errors)}`,
    ),
  );
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function respondUnavailableOnThrow(respond: RespondFn, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (err) {
    respond(false, undefined, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function uniqueSortedStrings(values: unknown[]) {
  return [...new Set(values.filter((v) => typeof v === "string"))]
    .map((v) => v.trim())
    .filter(Boolean)
    .toSorted();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function safeParseJson(value: string | null | undefined): unknown {
  if (typeof value !== "string") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return { payloadJSON: value };
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function respondUnavailableOnNodeInvokeError<T extends { ok: boolean; error?: unknown }>(
  respond: RespondFn,
  res: T,
): res is T & { ok: true } {
  if (res.ok) {
    return true;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const message =
    res.error && typeof res.error === "object" && "message" in res.error
      ? (res.error as { message?: unknown }).message
      : null;
  respond(
    false,
    undefined,
    errorShape(
      ErrorCodes.UNAVAILABLE,
      typeof message === "string" ? message : "node invoke failed",
      {
        details: { nodeError: res.error ?? null },
      },
    ),
  );
  return false;
}
