# AUTOPLACEHOLDER_ANNOTATION: src/node-host/config.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";

export type NodeHostGatewayConfig = {
  host?: string;
  port?: number;
  tls?: boolean;
  tlsFingerprint?: string;
};

export type NodeHostConfig = {
  version: 1;
  nodeId: string;
  token?: string;
  displayName?: string;
  gateway?: NodeHostGatewayConfig;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const NODE_HOST_FILE = "node.json";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveNodeHostConfigPath(): string {
  return path.join(resolveStateDir(), NODE_HOST_FILE);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeConfig(config: Partial<NodeHostConfig> | null): NodeHostConfig {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const base: NodeHostConfig = {
    version: 1,
    nodeId: "",
    token: config?.token,
    displayName: config?.displayName,
    gateway: config?.gateway,
  };
  if (config?.version === 1 && typeof config.nodeId === "string") {
    base.nodeId = config.nodeId.trim();
  }
  if (!base.nodeId) {
    base.nodeId = crypto.randomUUID();
  }
  return base;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function loadNodeHostConfig(): Promise<NodeHostConfig | null> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const filePath = resolveNodeHostConfigPath();
  try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = await fs.readFile(filePath, "utf8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = JSON.parse(raw) as Partial<NodeHostConfig>;
    return normalizeConfig(parsed);
  } catch {
    return null;
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function saveNodeHostConfig(config: NodeHostConfig): Promise<void> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const filePath = resolveNodeHostConfigPath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const payload = JSON.stringify(config, null, 2);
  await fs.writeFile(filePath, `${payload}\n`, { mode: 0o600 });
  try {
    await fs.chmod(filePath, 0o600);
  } catch {
    // best-effort on platforms without chmod
  }
}

export async function ensureNodeHostConfig(): Promise<NodeHostConfig> {
  const existing = await loadNodeHostConfig();
  const normalized = normalizeConfig(existing);
  await saveNodeHostConfig(normalized);
  return normalized;
}
