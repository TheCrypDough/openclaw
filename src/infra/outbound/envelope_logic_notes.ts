/*
 * AUTO ANNOTATION
 * File: src/infra/outbound/envelope.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { ReplyPayload } from "../../auto-reply/types.js";
import type { OutboundDeliveryJson } from "./format.js";
import { normalizeOutboundPayloadsForJson, type OutboundPayloadJson } from "./payloads.js";

export type OutboundResultEnvelope = {
  payloads?: OutboundPayloadJson[];
  meta?: unknown;
  delivery?: OutboundDeliveryJson;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type BuildEnvelopeParams = {
  payloads?: readonly ReplyPayload[] | readonly OutboundPayloadJson[];
  meta?: unknown;
  delivery?: OutboundDeliveryJson;
  flattenDelivery?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const isOutboundPayloadJson = (
  payload: ReplyPayload | OutboundPayloadJson,
): payload is OutboundPayloadJson => "mediaUrl" in payload;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function buildOutboundResultEnvelope(
  params: BuildEnvelopeParams,
): OutboundResultEnvelope | OutboundDeliveryJson {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const hasPayloads = params.payloads !== undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payloads =
    params.payloads === undefined
      ? undefined
      : params.payloads.length === 0
        ? []
        : isOutboundPayloadJson(params.payloads[0])
          ? [...(params.payloads as readonly OutboundPayloadJson[])]
          : normalizeOutboundPayloadsForJson(params.payloads as readonly ReplyPayload[]);

  if (params.flattenDelivery !== false && params.delivery && !params.meta && !hasPayloads) {
    return params.delivery;
  }

  return {
    ...(hasPayloads ? { payloads } : {}),
    ...(params.meta ? { meta: params.meta } : {}),
    ...(params.delivery ? { delivery: params.delivery } : {}),
  };
}
