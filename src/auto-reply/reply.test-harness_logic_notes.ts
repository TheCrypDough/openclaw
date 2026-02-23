/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply.test-harness.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type HomeEnvSnapshot = {
  HOME: string | undefined;
  USERPROFILE: string | undefined;
  HOMEDRIVE: string | undefined;
  HOMEPATH: string | undefined;
  OPENCLAW_STATE_DIR: string | undefined;
  OPENCLAW_AGENT_DIR: string | undefined;
  PI_CODING_AGENT_DIR: string | undefined;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function snapshotHomeEnv(): HomeEnvSnapshot {
  return {
    HOME: process.env.HOME,
    USERPROFILE: process.env.USERPROFILE,
    HOMEDRIVE: process.env.HOMEDRIVE,
    HOMEPATH: process.env.HOMEPATH,
    OPENCLAW_STATE_DIR: process.env.OPENCLAW_STATE_DIR,
    OPENCLAW_AGENT_DIR: process.env.OPENCLAW_AGENT_DIR,
    PI_CODING_AGENT_DIR: process.env.PI_CODING_AGENT_DIR,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function restoreHomeEnv(snapshot: HomeEnvSnapshot) {
  for (const [key, value] of Object.entries(snapshot)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createTempHomeHarness(options: { prefix: string; beforeEachCase?: () => void }) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let fixtureRoot = "";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let caseId = 0;

  beforeAll(async () => {
    fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), options.prefix));
  });

  afterAll(async () => {
    if (!fixtureRoot) {
      return;
    }
    await fs.rm(fixtureRoot, { recursive: true, force: true });
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  async function withTempHome<T>(fn: (home: string) => Promise<T>): Promise<T> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const home = path.join(fixtureRoot, `case-${++caseId}`);
    await fs.mkdir(path.join(home, ".openclaw", "agents", "main", "sessions"), { recursive: true });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const envSnapshot = snapshotHomeEnv();
    process.env.HOME = home;
    process.env.USERPROFILE = home;
    process.env.OPENCLAW_STATE_DIR = path.join(home, ".openclaw");
    process.env.OPENCLAW_AGENT_DIR = path.join(home, ".openclaw", "agent");
    process.env.PI_CODING_AGENT_DIR = path.join(home, ".openclaw", "agent");

    if (process.platform === "win32") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const match = home.match(/^([A-Za-z]:)(.*)$/);
      if (match) {
        process.env.HOMEDRIVE = match[1];
        process.env.HOMEPATH = match[2] || "\\";
      }
    }

    try {
      options.beforeEachCase?.();
      return await fn(home);
    } finally {
      restoreHomeEnv(envSnapshot);
    }
  }

  return { withTempHome };
}

export function makeReplyConfig(home: string) {
  return {
    agents: {
      defaults: {
        model: "anthropic/claude-opus-4-5",
        workspace: path.join(home, "openclaw"),
      },
    },
    channels: {
      whatsapp: {
        allowFrom: ["*"],
      },
    },
    session: { store: path.join(home, "sessions.json") },
  };
}
