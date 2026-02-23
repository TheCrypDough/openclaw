/*
 * AUTO ANNOTATION
 * File: src/cli/nodes-cli/pairing-render.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { formatTimeAgo } from "../../infra/format-time/format-relative.ts";
import { renderTable } from "../../terminal/table.js";
import type { PendingRequest } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function renderPendingPairingRequestsTable(params: {
  pending: PendingRequest[];
  now: number;
  tableWidth: number;
  theme: {
    heading: (text: string) => string;
    warn: (text: string) => string;
    muted: (text: string) => string;
  };
}) {
  const { pending, now, tableWidth, theme } = params;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rows = pending.map((r) => ({
    Request: r.requestId,
    Node: r.displayName?.trim() ? r.displayName.trim() : r.nodeId,
    IP: r.remoteIp ?? "",
    Requested:
      typeof r.ts === "number" ? formatTimeAgo(Math.max(0, now - r.ts)) : theme.muted("unknown"),
    Repair: r.isRepair ? theme.warn("yes") : "",
  }));
  return {
    heading: theme.heading("Pending"),
    table: renderTable({
      width: tableWidth,
      columns: [
        { key: "Request", header: "Request", minWidth: 8 },
        { key: "Node", header: "Node", minWidth: 14, flex: true },
        { key: "IP", header: "IP", minWidth: 10 },
        { key: "Requested", header: "Requested", minWidth: 12 },
        { key: "Repair", header: "Repair", minWidth: 6 },
      ],
      rows,
    }).trimEnd(),
  };
}
