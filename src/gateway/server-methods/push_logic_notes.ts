/*
 * AUTO ANNOTATION
 * File: src/gateway/server-methods/push.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  loadApnsRegistration,
  normalizeApnsEnvironment,
  resolveApnsAuthConfigFromEnv,
  sendApnsAlert,
} from "../../infra/push-apns.js";
import { ErrorCodes, errorShape, validatePushTestParams } from "../protocol/index.js";
import { respondInvalidParams, respondUnavailableOnThrow } from "./nodes.helpers.js";
import type { GatewayRequestHandlers } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const pushHandlers: GatewayRequestHandlers = {
  "push.test": async ({ params, respond }) => {
    if (!validatePushTestParams(params)) {
      respondInvalidParams({
        respond,
        method: "push.test",
        validator: validatePushTestParams,
      });
      return;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const nodeId = String(params.nodeId ?? "").trim();
    if (!nodeId) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId required"));
      return;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const title = normalizeOptionalString(params.title) ?? "OpenClaw";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const body = normalizeOptionalString(params.body) ?? `Push test for node ${nodeId}`;

    await respondUnavailableOnThrow(respond, async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const registration = await loadApnsRegistration(nodeId);
      if (!registration) {
        respond(
          false,
          undefined,
          errorShape(
            ErrorCodes.INVALID_REQUEST,
            `node ${nodeId} has no APNs registration (connect iOS node first)`,
          ),
        );
        return;
      }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const auth = await resolveApnsAuthConfigFromEnv(process.env);
      if (!auth.ok) {
        respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, auth.error));
        return;
      }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const overrideEnvironment = normalizeApnsEnvironment(params.environment);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const result = await sendApnsAlert({
        auth: auth.value,
        registration: {
          ...registration,
          environment: overrideEnvironment ?? registration.environment,
        },
        nodeId,
        title,
        body,
      });
      respond(true, result, undefined);
    });
  },
};
