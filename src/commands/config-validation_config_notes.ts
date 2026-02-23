# AUTOPLACEHOLDER_ANNOTATION: src/commands/config-validation.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { formatCliCommand } from "../cli/command-format.js";
import { type OpenClawConfig, readConfigFileSnapshot } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function requireValidConfigSnapshot(
  runtime: RuntimeEnv,
): Promise<OpenClawConfig | null> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const snapshot = await readConfigFileSnapshot();
  if (snapshot.exists && !snapshot.valid) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const issues =
      snapshot.issues.length > 0
        ? snapshot.issues.map((issue) => `- ${issue.path}: ${issue.message}`).join("\n")
        : "Unknown validation issue.";
    runtime.error(`Config invalid:\n${issues}`);
    runtime.error(`Fix the config or run ${formatCliCommand("openclaw doctor")}.`);
    runtime.exit(1);
    return null;
  }
  return snapshot.config;
}
