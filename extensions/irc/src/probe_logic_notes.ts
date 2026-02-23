/*
 * AUTO ANNOTATION
 * File: extensions/irc/src/probe.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { resolveIrcAccount } from "./accounts.js";
import { connectIrcClient } from "./client.js";
import { buildIrcConnectOptions } from "./connect-options.js";
import type { CoreConfig, IrcProbe } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function formatError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return typeof err === "string" ? err : JSON.stringify(err);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function probeIrc(
  cfg: CoreConfig,
  opts?: { accountId?: string; timeoutMs?: number },
): Promise<IrcProbe> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const account = resolveIrcAccount({ cfg, accountId: opts?.accountId });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base: IrcProbe = {
    ok: false,
    host: account.host,
    port: account.port,
    tls: account.tls,
    nick: account.nick,
  };

  if (!account.configured) {
    return {
      ...base,
      error: "missing host or nick",
    };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const started = Date.now();
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const client = await connectIrcClient(
      buildIrcConnectOptions(account, {
        connectTimeoutMs: opts?.timeoutMs ?? 8000,
      }),
    );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const elapsed = Date.now() - started;
    client.quit("probe");
    return {
      ...base,
      ok: true,
      latencyMs: elapsed,
    };
  } catch (err) {
    return {
      ...base,
      error: formatError(err),
    };
  }
}
