# AUTOPLACEHOLDER_ANNOTATION: src/gateway/test-temp-config.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function withTempConfig(params: {
  cfg: unknown;
  run: () => Promise<void>;
  prefix?: string;
}): Promise<void> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prevConfigPath = process.env.OPENCLAW_CONFIG_PATH;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const prevDisableCache = process.env.OPENCLAW_DISABLE_CONFIG_CACHE;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const dir = await mkdtemp(path.join(os.tmpdir(), params.prefix ?? "openclaw-test-config-"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const configPath = path.join(dir, "openclaw.json");

  process.env.OPENCLAW_CONFIG_PATH = configPath;
  process.env.OPENCLAW_DISABLE_CONFIG_CACHE = "1";

  try {
    await writeFile(configPath, JSON.stringify(params.cfg, null, 2), "utf-8");
    await params.run();
  } finally {
    if (prevConfigPath === undefined) {
      delete process.env.OPENCLAW_CONFIG_PATH;
    } else {
      process.env.OPENCLAW_CONFIG_PATH = prevConfigPath;
    }
    if (prevDisableCache === undefined) {
      delete process.env.OPENCLAW_DISABLE_CONFIG_CACHE;
    } else {
      process.env.OPENCLAW_DISABLE_CONFIG_CACHE = prevDisableCache;
    }
    await rm(dir, { recursive: true, force: true });
  }
}
