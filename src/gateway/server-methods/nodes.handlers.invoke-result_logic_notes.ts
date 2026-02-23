/*
 * AUTO ANNOTATION
 * File: src/gateway/server-methods/nodes.handlers.invoke-result.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { ErrorCodes, errorShape, validateNodeInvokeResultParams } from "../protocol/index.js";
import { respondInvalidParams } from "./nodes.helpers.js";
import type { GatewayRequestHandler } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeNodeInvokeResultParams(params: unknown): unknown {
  if (!params || typeof params !== "object") {
    return params;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const raw = params as Record<string, unknown>;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized: Record<string, unknown> = { ...raw };
  if (normalized.payloadJSON === null) {
    delete normalized.payloadJSON;
  } else if (normalized.payloadJSON !== undefined && typeof normalized.payloadJSON !== "string") {
    if (normalized.payload === undefined) {
      normalized.payload = normalized.payloadJSON;
    }
    delete normalized.payloadJSON;
  }
  if (normalized.error === null) {
    delete normalized.error;
  }
  return normalized;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const handleNodeInvokeResult: GatewayRequestHandler = async ({
  params,
  respond,
  context,
  client,
}) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalizedParams = normalizeNodeInvokeResultParams(params);
  if (!validateNodeInvokeResultParams(normalizedParams)) {
    respondInvalidParams({
      respond,
      method: "node.invoke.result",
      validator: validateNodeInvokeResultParams,
    });
    return;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const p = normalizedParams as {
    id: string;
    nodeId: string;
    ok: boolean;
    payload?: unknown;
    payloadJSON?: string | null;
    error?: { code?: string; message?: string } | null;
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const callerNodeId = client?.connect?.device?.id ?? client?.connect?.client?.id;
  if (callerNodeId && callerNodeId !== p.nodeId) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId mismatch"));
    return;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const ok = context.nodeRegistry.handleInvokeResult({
    id: p.id,
    nodeId: p.nodeId,
    ok: p.ok,
    payload: p.payload,
    payloadJSON: p.payloadJSON ?? null,
    error: p.error ?? null,
  });
  if (!ok) {
    // Late-arriving results (after invoke timeout) are expected and harmless.
    // Return success instead of error to reduce log noise; client can discard.
    context.logGateway.debug(`late invoke result ignored: id=${p.id} node=${p.nodeId}`);
    respond(true, { ok: true, ignored: true }, undefined);
    return;
  }

  respond(true, { ok: true }, undefined);
};
