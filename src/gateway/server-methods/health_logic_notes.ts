/*
 * AUTO ANNOTATION
 * File: src/gateway/server-methods/health.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getStatusSummary } from "../../commands/status.js";
import { ErrorCodes, errorShape } from "../protocol/index.js";
import { HEALTH_REFRESH_INTERVAL_MS } from "../server-constants.js";
import { formatError } from "../server-utils.js";
import { formatForLog } from "../ws-log.js";
import type { GatewayRequestHandlers } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ADMIN_SCOPE = "operator.admin";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export const healthHandlers: GatewayRequestHandlers = {
  health: async ({ respond, context, params }) => {
    const { getHealthCache, refreshHealthSnapshot, logHealth } = context;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const wantsProbe = params?.probe === true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const now = Date.now();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cached = getHealthCache();
    if (!wantsProbe && cached && now - cached.ts < HEALTH_REFRESH_INTERVAL_MS) {
      respond(true, cached, undefined, { cached: true });
      void refreshHealthSnapshot({ probe: false }).catch((err) =>
        logHealth.error(`background health refresh failed: ${formatError(err)}`),
      );
      return;
    }
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const snap = await refreshHealthSnapshot({ probe: wantsProbe });
      respond(true, snap, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
    }
  },
  status: async ({ respond, client }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const status = await getStatusSummary({
      includeSensitive: scopes.includes(ADMIN_SCOPE),
    });
    respond(true, status, undefined);
  },
};
