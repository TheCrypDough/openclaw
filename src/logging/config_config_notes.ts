# AUTOPLACEHOLDER_ANNOTATION: src/logging/config.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import fs from "node:fs";
import json5 from "json5";
import { resolveConfigPath } from "../config/paths.js";
import type { OpenClawConfig } from "../config/types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type LoggingConfig = OpenClawConfig["logging"];

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function readLoggingConfig(): LoggingConfig | undefined {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configPath = resolveConfigPath();
  try {
    if (!fs.existsSync(configPath)) {
      return undefined;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = fs.readFileSync(configPath, "utf-8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = json5.parse(raw);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const logging = parsed?.logging;
    if (!logging || typeof logging !== "object" || Array.isArray(logging)) {
      return undefined;
    }
    return logging as LoggingConfig;
  } catch {
    return undefined;
  }
}
