/*
 * AUTO ANNOTATION
 * File: src/test-utils/temp-home.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { captureEnv } from "./env.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const HOME_ENV_KEYS = [
  "HOME",
  "USERPROFILE",
  "HOMEDRIVE",
  "HOMEPATH",
  "OPENCLAW_STATE_DIR",
] as const;

export type TempHomeEnv = {
  home: string;
  restore: () => Promise<void>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export async function createTempHomeEnv(prefix: string): Promise<TempHomeEnv> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const home = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  await fs.mkdir(path.join(home, ".openclaw"), { recursive: true });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const snapshot = captureEnv([...HOME_ENV_KEYS]);
  process.env.HOME = home;
  process.env.USERPROFILE = home;
  process.env.OPENCLAW_STATE_DIR = path.join(home, ".openclaw");

  if (process.platform === "win32") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const match = home.match(/^([A-Za-z]:)(.*)$/);
    if (match) {
      process.env.HOMEDRIVE = match[1];
      process.env.HOMEPATH = match[2] || "\\";
    }
  }

  return {
    home,
    restore: async () => {
      snapshot.restore();
      await fs.rm(home, { recursive: true, force: true });
    },
  };
}
