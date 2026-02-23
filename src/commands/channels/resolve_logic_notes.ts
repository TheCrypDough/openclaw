/*
 * AUTO ANNOTATION
 * File: src/commands/channels/resolve.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { getChannelPlugin } from "../../channels/plugins/index.js";
import type { ChannelResolveKind, ChannelResolveResult } from "../../channels/plugins/types.js";
import { loadConfig } from "../../config/config.js";
import { danger } from "../../globals.js";
import { resolveMessageChannelSelection } from "../../infra/outbound/channel-selection.js";
import type { RuntimeEnv } from "../../runtime.js";

export type ChannelsResolveOptions = {
  channel?: string;
  account?: string;
  kind?: "auto" | "user" | "group" | "channel";
  json?: boolean;
  entries?: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ResolveResult = {
  input: string;
  resolved: boolean;
  id?: string;
  name?: string;
  error?: string;
  note?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function resolvePreferredKind(
  kind?: ChannelsResolveOptions["kind"],
): ChannelResolveKind | undefined {
  if (!kind || kind === "auto") {
    return undefined;
  }
  if (kind === "user") {
    return "user";
  }
  return "group";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function detectAutoKind(input: string): ChannelResolveKind {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const trimmed = input.trim();
  if (!trimmed) {
    return "group";
  }
  if (trimmed.startsWith("@")) {
    return "user";
  }
  if (/^<@!?/.test(trimmed)) {
    return "user";
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "user";
  }
  if (
    /^(user|discord|slack|matrix|msteams|teams|zalo|zalouser|googlechat|google-chat|gchat):/i.test(
      trimmed,
    )
  ) {
    return "user";
  }
  return "group";
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatResolveResult(result: ResolveResult): string {
  if (!result.resolved || !result.id) {
    return `${result.input} -> unresolved`;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const name = result.name ? ` (${result.name})` : "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const note = result.note ? ` [${result.note}]` : "";
  return `${result.input} -> ${result.id}${name}${note}`;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function channelsResolveCommand(opts: ChannelsResolveOptions, runtime: RuntimeEnv) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = loadConfig();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const entries = (opts.entries ?? []).map((entry) => entry.trim()).filter(Boolean);
  if (entries.length === 0) {
    throw new Error("At least one entry is required.");
  }

  const selection = await resolveMessageChannelSelection({
    cfg,
    channel: opts.channel ?? null,
  });
  const plugin = getChannelPlugin(selection.channel);
  if (!plugin?.resolver?.resolveTargets) {
    throw new Error(`Channel ${selection.channel} does not support resolve.`);
  }
  const preferredKind = resolvePreferredKind(opts.kind);

  let results: ResolveResult[] = [];
  if (preferredKind) {
    const resolved = await plugin.resolver.resolveTargets({
      cfg,
      accountId: opts.account ?? null,
      inputs: entries,
      kind: preferredKind,
      runtime,
    });
    results = resolved.map((entry) => ({
      input: entry.input,
      resolved: entry.resolved,
      id: entry.id,
      name: entry.name,
      note: entry.note,
    }));
  } else {
    const byKind = new Map<ChannelResolveKind, string[]>();
    for (const entry of entries) {
      const kind = detectAutoKind(entry);
      byKind.set(kind, [...(byKind.get(kind) ?? []), entry]);
    }
    const resolved: ChannelResolveResult[] = [];
    for (const [kind, inputs] of byKind.entries()) {
      const batch = await plugin.resolver.resolveTargets({
        cfg,
        accountId: opts.account ?? null,
        inputs,
        kind,
        runtime,
      });
      resolved.push(...batch);
    }
    const byInput = new Map(resolved.map((entry) => [entry.input, entry]));
    results = entries.map((input) => {
      const entry = byInput.get(input);
      return {
        input,
        resolved: entry?.resolved ?? false,
        id: entry?.id,
        name: entry?.name,
        note: entry?.note,
      };
    });
  }

  if (opts.json) {
    runtime.log(JSON.stringify(results, null, 2));
    return;
  }

  for (const result of results) {
    if (result.resolved && result.id) {
      runtime.log(formatResolveResult(result));
    } else {
      runtime.error(
        danger(
          `${result.input} -> unresolved${result.error ? ` (${result.error})` : result.note ? ` (${result.note})` : ""}`,
        ),
      );
    }
  }
}
