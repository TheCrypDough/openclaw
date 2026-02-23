/*
 * AUTO ANNOTATION
 * File: src/discord/gateway-logging.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { EventEmitter } from "node:events";
import { logVerbose } from "../globals.js";
import type { RuntimeEnv } from "../runtime.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type GatewayEmitter = Pick<EventEmitter, "on" | "removeListener">;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const INFO_DEBUG_MARKERS = [
  "WebSocket connection closed",
  "Reconnecting with backoff",
  "Attempting resume with backoff",
];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const shouldPromoteGatewayDebug = (message: string) =>
  INFO_DEBUG_MARKERS.some((marker) => message.includes(marker));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const formatGatewayMetrics = (metrics: unknown) => {
  if (metrics === null || metrics === undefined) {
    return String(metrics);
  }
  if (typeof metrics === "string") {
    return metrics;
  }
  if (typeof metrics === "number" || typeof metrics === "boolean" || typeof metrics === "bigint") {
    return String(metrics);
  }
  try {
    return JSON.stringify(metrics);
  } catch {
    return "[unserializable metrics]";
  }
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function attachDiscordGatewayLogging(params: {
  emitter?: GatewayEmitter;
  runtime: RuntimeEnv;
}) {
  const { emitter, runtime } = params;
  if (!emitter) {
    return () => {};
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const onGatewayDebug = (msg: unknown) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = String(msg);
    logVerbose(`discord gateway: ${message}`);
    if (shouldPromoteGatewayDebug(message)) {
      runtime.log?.(`discord gateway: ${message}`);
    }
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const onGatewayWarning = (warning: unknown) => {
    logVerbose(`discord gateway warning: ${String(warning)}`);
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const onGatewayMetrics = (metrics: unknown) => {
    logVerbose(`discord gateway metrics: ${formatGatewayMetrics(metrics)}`);
  };

  emitter.on("debug", onGatewayDebug);
  emitter.on("warning", onGatewayWarning);
  emitter.on("metrics", onGatewayMetrics);

  return () => {
    emitter.removeListener("debug", onGatewayDebug);
    emitter.removeListener("warning", onGatewayWarning);
    emitter.removeListener("metrics", onGatewayMetrics);
  };
}
