/*
 * AUTO ANNOTATION
 * File: src/commands/status.link-channel.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveChannelDefaultAccountId } from "../channels/plugins/helpers.js";
import { listChannelPlugins } from "../channels/plugins/index.js";
import type { ChannelAccountSnapshot, ChannelPlugin } from "../channels/plugins/types.js";
import type { OpenClawConfig } from "../config/config.js";

export type LinkChannelContext = {
  linked: boolean;
  authAgeMs: number | null;
  account?: unknown;
  accountId?: string;
  plugin: ChannelPlugin;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function resolveLinkChannelContext(
  cfg: OpenClawConfig,
): Promise<LinkChannelContext | null> {
  for (const plugin of listChannelPlugins()) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const accountIds = plugin.config.listAccountIds(cfg);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const defaultAccountId = resolveChannelDefaultAccountId({
      plugin,
      cfg,
      accountIds,
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const account = plugin.config.resolveAccount(cfg, defaultAccountId);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const enabled = plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const configured = plugin.config.isConfigured
      ? await plugin.config.isConfigured(account, cfg)
      : true;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const snapshot = plugin.config.describeAccount
      ? plugin.config.describeAccount(account, cfg)
      : ({
          accountId: defaultAccountId,
          enabled,
          configured,
        } as ChannelAccountSnapshot);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const summary = plugin.status?.buildChannelSummary
      ? await plugin.status.buildChannelSummary({
          account,
          cfg,
          defaultAccountId,
          snapshot,
        })
      : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const summaryRecord = summary;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const linked =
      summaryRecord && typeof summaryRecord.linked === "boolean" ? summaryRecord.linked : null;
    if (linked === null) {
      continue;
    }
    const authAgeMs =
      summaryRecord && typeof summaryRecord.authAgeMs === "number" ? summaryRecord.authAgeMs : null;
    return { linked, authAgeMs, account, accountId: defaultAccountId, plugin };
  }
  return null;
}
