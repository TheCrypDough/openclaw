/*
 * AUTO ANNOTATION
 * File: src/commands/dashboard.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { readConfigFileSnapshot, resolveGatewayPort } from "../config/config.js";
import { copyToClipboard } from "../infra/clipboard.js";
import type { RuntimeEnv } from "../runtime.js";
import { defaultRuntime } from "../runtime.js";
import {
  detectBrowserOpenSupport,
  formatControlUiSshHint,
  openUrl,
  resolveControlUiLinks,
} from "./onboard-helpers.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DashboardOptions = {
  noOpen?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function dashboardCommand(
  runtime: RuntimeEnv = defaultRuntime,
  options: DashboardOptions = {},
) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const snapshot = await readConfigFileSnapshot();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = snapshot.valid ? snapshot.config : {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const port = resolveGatewayPort(cfg);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const bind = cfg.gateway?.bind ?? "loopback";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const basePath = cfg.gateway?.controlUi?.basePath;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const customBindHost = cfg.gateway?.customBindHost;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const token = cfg.gateway?.auth?.token ?? process.env.OPENCLAW_GATEWAY_TOKEN ?? "";

  // LAN URLs fail secure-context checks in browsers.
  // Coerce only lan->loopback and preserve other bind modes.
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const links = resolveControlUiLinks({
    port,
    bind: bind === "lan" ? "loopback" : bind,
    customBindHost,
    basePath,
  });
  // Prefer URL fragment to avoid leaking auth tokens via query params.
  const dashboardUrl = token
    ? `${links.httpUrl}#token=${encodeURIComponent(token)}`
    : links.httpUrl;

  runtime.log(`Dashboard URL: ${dashboardUrl}`);

  const copied = await copyToClipboard(dashboardUrl).catch(() => false);
  runtime.log(copied ? "Copied to clipboard." : "Copy to clipboard unavailable.");

  let opened = false;
  let hint: string | undefined;
  if (!options.noOpen) {
    const browserSupport = await detectBrowserOpenSupport();
    if (browserSupport.ok) {
      opened = await openUrl(dashboardUrl);
    }
    if (!opened) {
      hint = formatControlUiSshHint({
        port,
        basePath,
        token: token || undefined,
      });
    }
  } else {
    hint = "Browser launch disabled (--no-open). Use the URL above.";
  }

  if (opened) {
    runtime.log("Opened in your browser. Keep that tab to control OpenClaw.");
  } else if (hint) {
    runtime.log(hint);
  }
}
