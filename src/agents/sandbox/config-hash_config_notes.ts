# AUTOPLACEHOLDER_ANNOTATION: src/agents/sandbox/config-hash.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { hashTextSha256 } from "./hash.js";
import type { SandboxBrowserConfig, SandboxDockerConfig, SandboxWorkspaceAccess } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SandboxHashInput = {
  docker: SandboxDockerConfig;
  workspaceAccess: SandboxWorkspaceAccess;
  workspaceDir: string;
  agentWorkspaceDir: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type SandboxBrowserHashInput = {
  docker: SandboxDockerConfig;
  browser: Pick<
    SandboxBrowserConfig,
    "cdpPort" | "cdpSourceRange" | "vncPort" | "noVncPort" | "headless" | "enableNoVnc"
  >;
  securityEpoch: string;
  workspaceAccess: SandboxWorkspaceAccess;
  workspaceDir: string;
  agentWorkspaceDir: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeForHash(value: unknown): unknown {
  if (value === undefined) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.map(normalizeForHash).filter((item): item is unknown => item !== undefined);
  }
  if (value && typeof value === "object") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const entries = Object.entries(value).toSorted(([a], [b]) => a.localeCompare(b));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized: Record<string, unknown> = {};
    for (const [key, entryValue] of entries) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const next = normalizeForHash(entryValue);
      if (next !== undefined) {
        normalized[key] = next;
      }
    }
    return normalized;
  }
  return value;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function computeSandboxConfigHash(input: SandboxHashInput): string {
  return computeHash(input);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function computeSandboxBrowserConfigHash(input: SandboxBrowserHashInput): string {
  return computeHash(input);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function computeHash(input: unknown): string {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const payload = normalizeForHash(input);
  const raw = JSON.stringify(payload);
  return hashTextSha256(raw);
}
