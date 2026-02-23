/*
 * AUTO ANNOTATION
 * File: src/agents/sandbox/tool-policy.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { OpenClawConfig } from "../../config/config.js";
import { resolveAgentConfig } from "../agent-scope.js";
import { compileGlobPatterns, matchesAnyGlobPattern } from "../glob-pattern.js";
import { expandToolGroups } from "../tool-policy.js";
import { DEFAULT_TOOL_ALLOW, DEFAULT_TOOL_DENY } from "./constants.js";
import type {
  SandboxToolPolicy,
  SandboxToolPolicyResolved,
  SandboxToolPolicySource,
} from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function normalizeGlob(value: string) {
  return value.trim().toLowerCase();
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function isToolAllowed(policy: SandboxToolPolicy, name: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const normalized = normalizeGlob(name);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const deny = compileGlobPatterns({
    raw: expandToolGroups(policy.deny ?? []),
    normalize: normalizeGlob,
  });
  if (matchesAnyGlobPattern(normalized, deny)) {
    return false;
  }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const allow = compileGlobPatterns({
    raw: expandToolGroups(policy.allow ?? []),
    normalize: normalizeGlob,
  });
  if (allow.length === 0) {
    return true;
  }
  return matchesAnyGlobPattern(normalized, allow);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function resolveSandboxToolPolicyForAgent(
  cfg?: OpenClawConfig,
  agentId?: string,
): SandboxToolPolicyResolved {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentConfig = cfg && agentId ? resolveAgentConfig(cfg, agentId) : undefined;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentAllow = agentConfig?.tools?.sandbox?.tools?.allow;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentDeny = agentConfig?.tools?.sandbox?.tools?.deny;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const globalAllow = cfg?.tools?.sandbox?.tools?.allow;
  const globalDeny = cfg?.tools?.sandbox?.tools?.deny;

  const allowSource = Array.isArray(agentAllow)
    ? ({
        source: "agent",
        key: "agents.list[].tools.sandbox.tools.allow",
      } satisfies SandboxToolPolicySource)
    : Array.isArray(globalAllow)
      ? ({
          source: "global",
          key: "tools.sandbox.tools.allow",
        } satisfies SandboxToolPolicySource)
      : ({
          source: "default",
          key: "tools.sandbox.tools.allow",
        } satisfies SandboxToolPolicySource);

  const denySource = Array.isArray(agentDeny)
    ? ({
        source: "agent",
        key: "agents.list[].tools.sandbox.tools.deny",
      } satisfies SandboxToolPolicySource)
    : Array.isArray(globalDeny)
      ? ({
          source: "global",
          key: "tools.sandbox.tools.deny",
        } satisfies SandboxToolPolicySource)
      : ({
          source: "default",
          key: "tools.sandbox.tools.deny",
        } satisfies SandboxToolPolicySource);

  const deny = Array.isArray(agentDeny)
    ? agentDeny
    : Array.isArray(globalDeny)
      ? globalDeny
      : [...DEFAULT_TOOL_DENY];
  const allow = Array.isArray(agentAllow)
    ? agentAllow
    : Array.isArray(globalAllow)
      ? globalAllow
      : [...DEFAULT_TOOL_ALLOW];

  const expandedDeny = expandToolGroups(deny);
  let expandedAllow = expandToolGroups(allow);

  // `image` is essential for multimodal workflows; always include it in sandboxed
  // sessions unless explicitly denied.
  if (
    // Empty allowlist means "allow all" for `isToolAllowed`, so don't inject a
    // single tool that would accidentally turn it into an explicit allowlist.
    expandedAllow.length > 0 &&
    !expandedDeny.map((v) => v.toLowerCase()).includes("image") &&
    !expandedAllow.map((v) => v.toLowerCase()).includes("image")
  ) {
    expandedAllow = [...expandedAllow, "image"];
  }

  return {
    allow: expandedAllow,
    deny: expandedDeny,
    sources: {
      allow: allowSource,
      deny: denySource,
    },
  };
}
