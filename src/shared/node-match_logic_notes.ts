/*
 * AUTO ANNOTATION
 * File: src/shared/node-match.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type NodeMatchCandidate = {
  nodeId: string;
  displayName?: string;
  remoteIp?: string;
  connected?: boolean;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function normalizeNodeKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function listKnownNodes(nodes: NodeMatchCandidate[]): string {
  return nodes
    .map((n) => n.displayName || n.remoteIp || n.nodeId)
    .filter(Boolean)
    .join(", ");
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveNodeMatches(
  nodes: NodeMatchCandidate[],
  query: string,
): NodeMatchCandidate[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const q = query.trim();
  if (!q) {
    return [];
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const qNorm = normalizeNodeKey(q);
  return nodes.filter((n) => {
    if (n.nodeId === q) {
      return true;
    }
    if (typeof n.remoteIp === "string" && n.remoteIp === q) {
      return true;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const name = typeof n.displayName === "string" ? n.displayName : "";
    if (name && normalizeNodeKey(name) === qNorm) {
      return true;
    }
    if (q.length >= 6 && n.nodeId.startsWith(q)) {
      return true;
    }
    return false;
  });
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveNodeIdFromCandidates(nodes: NodeMatchCandidate[], query: string): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const q = query.trim();
  if (!q) {
    throw new Error("node required");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const rawMatches = resolveNodeMatches(nodes, q);
  if (rawMatches.length === 1) {
    return rawMatches[0]?.nodeId ?? "";
  }
  if (rawMatches.length === 0) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const known = listKnownNodes(nodes);
    throw new Error(`unknown node: ${q}${known ? ` (known: ${known})` : ""}`);
  }

  // Re-pair/reinstall flows can leave multiple nodes with the same display name.
  // Prefer a unique connected match when available.
  const connectedMatches = rawMatches.filter((match) => match.connected === true);
  const matches = connectedMatches.length > 0 ? connectedMatches : rawMatches;
  if (matches.length === 1) {
    return matches[0]?.nodeId ?? "";
  }

  throw new Error(
    `ambiguous node: ${q} (matches: ${matches
      .map((n) => n.displayName || n.remoteIp || n.nodeId)
      .join(", ")})`,
  );
}
