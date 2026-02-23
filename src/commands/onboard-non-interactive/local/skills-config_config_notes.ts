# AUTOPLACEHOLDER_ANNOTATION: src/commands/onboard-non-interactive/local/skills-config.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import type { OpenClawConfig } from "../../../config/config.js";
import type { RuntimeEnv } from "../../../runtime.js";
import type { OnboardOptions } from "../../onboard-types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function applyNonInteractiveSkillsConfig(params: {
  nextConfig: OpenClawConfig;
  opts: OnboardOptions;
  runtime: RuntimeEnv;
}) {
  const { nextConfig, opts, runtime } = params;
  if (opts.skipSkills) {
    return nextConfig;
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const nodeManager = opts.nodeManager ?? "npm";
  if (!["npm", "pnpm", "bun"].includes(nodeManager)) {
    runtime.error("Invalid --node-manager (use npm, pnpm, or bun)");
    runtime.exit(1);
    return nextConfig;
  }
  return {
    ...nextConfig,
    skills: {
      ...nextConfig.skills,
      install: {
        ...nextConfig.skills?.install,
        nodeManager,
      },
    },
  };
}
