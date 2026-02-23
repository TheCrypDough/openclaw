/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/monitor/auto-join.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MatrixClient } from "@vector-im/matrix-bot-sdk";
import { AutojoinRoomsMixin } from "@vector-im/matrix-bot-sdk";
import type { RuntimeEnv } from "openclaw/plugin-sdk";
import { getMatrixRuntime } from "../../runtime.js";
import type { CoreConfig } from "../../types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function registerMatrixAutoJoin(params: {
  client: MatrixClient;
  cfg: CoreConfig;
  runtime: RuntimeEnv;
}) {
  const { client, cfg, runtime } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const core = getMatrixRuntime();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const logVerbose = (message: string) => {
    if (!core.logging.shouldLogVerbose()) {
      return;
    }
    runtime.log?.(message);
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const autoJoin = cfg.channels?.matrix?.autoJoin ?? "always";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const autoJoinAllowlist = cfg.channels?.matrix?.autoJoinAllowlist ?? [];

  if (autoJoin === "off") {
    return;
  }

  if (autoJoin === "always") {
    // Use the built-in autojoin mixin for "always" mode
    AutojoinRoomsMixin.setupOnClient(client);
    logVerbose("matrix: auto-join enabled for all invites");
    return;
  }

  // For "allowlist" mode, handle invites manually
  client.on("room.invite", async (roomId: string, _inviteEvent: unknown) => {
    if (autoJoin !== "allowlist") {
      return;
    }

    // Get room alias if available
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let alias: string | undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let altAliases: string[] = [];
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const aliasState = await client
        .getRoomStateEvent(roomId, "m.room.canonical_alias", "")
        .catch(() => null);
      alias = aliasState?.alias;
      altAliases = Array.isArray(aliasState?.alt_aliases) ? aliasState.alt_aliases : [];
    } catch {
      // Ignore errors
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const allowed =
      autoJoinAllowlist.includes("*") ||
      autoJoinAllowlist.includes(roomId) ||
      (alias ? autoJoinAllowlist.includes(alias) : false) ||
      altAliases.some((value) => autoJoinAllowlist.includes(value));

    if (!allowed) {
      logVerbose(`matrix: invite ignored (not in allowlist) room=${roomId}`);
      return;
    }

    try {
      await client.joinRoom(roomId);
      logVerbose(`matrix: joined room ${roomId}`);
    } catch (err) {
      runtime.error?.(`matrix: failed to join room ${roomId}: ${String(err)}`);
    }
  });
}
