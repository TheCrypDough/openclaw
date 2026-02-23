/*
 * AUTO ANNOTATION
 * File: src/agents/tools/nodes-utils.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { parseNodeList, parsePairingList } from "../../shared/node-list-parse.js";
import type { NodeListNode } from "../../shared/node-list-types.js";
import { resolveNodeIdFromCandidates } from "../../shared/node-match.js";
import { callGatewayTool, type GatewayCallOptions } from "./gateway.js";

export type { NodeListNode };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function loadNodes(opts: GatewayCallOptions): Promise<NodeListNode[]> {
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await callGatewayTool("node.list", opts, {});
    return parseNodeList(res);
  } catch {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = await callGatewayTool("node.pair.list", opts, {});
    const { paired } = parsePairingList(res);
    return paired.map((n) => ({
      nodeId: n.nodeId,
      displayName: n.displayName,
      platform: n.platform,
      remoteIp: n.remoteIp,
    }));
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function pickDefaultNode(nodes: NodeListNode[]): NodeListNode | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const withCanvas = nodes.filter((n) =>
    Array.isArray(n.caps) ? n.caps.includes("canvas") : true,
  );
  if (withCanvas.length === 0) {
    return null;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const connected = withCanvas.filter((n) => n.connected);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidates = connected.length > 0 ? connected : withCanvas;
  if (candidates.length === 1) {
    return candidates[0];
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const local = candidates.filter(
    (n) =>
      n.platform?.toLowerCase().startsWith("mac") &&
      typeof n.nodeId === "string" &&
      n.nodeId.startsWith("mac-"),
  );
  if (local.length === 1) {
    return local[0];
  }

  return null;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function listNodes(opts: GatewayCallOptions): Promise<NodeListNode[]> {
  return loadNodes(opts);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveNodeIdFromList(
  nodes: NodeListNode[],
  query?: string,
  allowDefault = false,
): string {
  const q = String(query ?? "").trim();
  if (!q) {
    if (allowDefault) {
      const picked = pickDefaultNode(nodes);
      if (picked) {
        return picked.nodeId;
      }
    }
    throw new Error("node required");
  }
  return resolveNodeIdFromCandidates(nodes, q);
}

export async function resolveNodeId(
  opts: GatewayCallOptions,
  query?: string,
  allowDefault = false,
) {
  const nodes = await loadNodes(opts);
  return resolveNodeIdFromList(nodes, query, allowDefault);
}
