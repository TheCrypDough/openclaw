/*
 * AUTO ANNOTATION
 * File: src/gateway/server-methods/voicewake.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { loadVoiceWakeConfig, setVoiceWakeTriggers } from "../../infra/voicewake.js";
import { ErrorCodes, errorShape } from "../protocol/index.js";
import { normalizeVoiceWakeTriggers } from "../server-utils.js";
import { formatForLog } from "../ws-log.js";
import type { GatewayRequestHandlers } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const voicewakeHandlers: GatewayRequestHandlers = {
  "voicewake.get": async ({ respond }) => {
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const cfg = await loadVoiceWakeConfig();
      respond(true, { triggers: cfg.triggers });
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
    }
  },
  "voicewake.set": async ({ params, respond, context }) => {
    if (!Array.isArray(params.triggers)) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, "voicewake.set requires triggers: string[]"),
      );
      return;
    }
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const triggers = normalizeVoiceWakeTriggers(params.triggers);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const cfg = await setVoiceWakeTriggers(triggers);
      context.broadcastVoiceWakeChanged(cfg.triggers);
      respond(true, { triggers: cfg.triggers });
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
    }
  },
};
