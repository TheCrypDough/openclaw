/*
 * AUTO ANNOTATION
 * File: src/config/talk.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type TalkApiKeyDeps = {
  fs?: typeof fs;
  os?: typeof os;
  path?: typeof path;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function readTalkApiKeyFromProfile(deps: TalkApiKeyDeps = {}): string | null {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const fsImpl = deps.fs ?? fs;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const osImpl = deps.os ?? os;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const pathImpl = deps.path ?? path;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const home = osImpl.homedir();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const candidates = [".profile", ".zprofile", ".zshrc", ".bashrc"].map((name) =>
    pathImpl.join(home, name),
  );
  for (const candidate of candidates) {
    if (!fsImpl.existsSync(candidate)) {
      continue;
    }
    try {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const text = fsImpl.readFileSync(candidate, "utf-8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const match = text.match(
        /(?:^|\n)\s*(?:export\s+)?ELEVENLABS_API_KEY\s*=\s*["']?([^\n"']+)["']?/,
      );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const value = match?.[1]?.trim();
      if (value) {
        return value;
      }
    } catch {
      // Ignore profile read errors.
    }
  }
  return null;
}

export function resolveTalkApiKey(
  env: NodeJS.ProcessEnv = process.env,
  deps: TalkApiKeyDeps = {},
): string | null {
  const envValue = (env.ELEVENLABS_API_KEY ?? "").trim();
  if (envValue) {
    return envValue;
  }
  return readTalkApiKeyFromProfile(deps);
}
