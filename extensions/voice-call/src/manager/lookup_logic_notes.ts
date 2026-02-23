/*
 * AUTO ANNOTATION
 * File: extensions/voice-call/src/manager/lookup.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { CallId, CallRecord } from "../types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function getCallByProviderCallId(params: {
  activeCalls: Map<CallId, CallRecord>;
  providerCallIdMap: Map<string, CallId>;
  providerCallId: string;
}): CallRecord | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const callId = params.providerCallIdMap.get(params.providerCallId);
  if (callId) {
    return params.activeCalls.get(callId);
  }

  for (const call of params.activeCalls.values()) {
    if (call.providerCallId === params.providerCallId) {
      return call;
    }
  }
  return undefined;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function findCall(params: {
  activeCalls: Map<CallId, CallRecord>;
  providerCallIdMap: Map<string, CallId>;
  callIdOrProviderCallId: string;
}): CallRecord | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const directCall = params.activeCalls.get(params.callIdOrProviderCallId);
  if (directCall) {
    return directCall;
  }
  return getCallByProviderCallId({
    activeCalls: params.activeCalls,
    providerCallIdMap: params.providerCallIdMap,
    providerCallId: params.callIdOrProviderCallId,
  });
}
