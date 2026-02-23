/*
 * AUTO ANNOTATION
 * File: src/commands/doctor-state-integrity.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { resolveStorePath, resolveSessionTranscriptsDirForAgent } from "../config/sessions.js";
import { note } from "../terminal/note.js";
import { noteStateIntegrity } from "./doctor-state-integrity.js";

vi.mock("../terminal/note.js", () => ({
  note: vi.fn(),
}));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type EnvSnapshot = {
  HOME?: string;
  OPENCLAW_HOME?: string;
  OPENCLAW_STATE_DIR?: string;
  OPENCLAW_OAUTH_DIR?: string;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function captureEnv(): EnvSnapshot {
  return {
    HOME: process.env.HOME,
    OPENCLAW_HOME: process.env.OPENCLAW_HOME,
    OPENCLAW_STATE_DIR: process.env.OPENCLAW_STATE_DIR,
    OPENCLAW_OAUTH_DIR: process.env.OPENCLAW_OAUTH_DIR,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function restoreEnv(snapshot: EnvSnapshot) {
  for (const key of Object.keys(snapshot) as Array<keyof EnvSnapshot>) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const value = snapshot[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function setupSessionState(cfg: OpenClawConfig, env: NodeJS.ProcessEnv, homeDir: string) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const agentId = "main";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sessionsDir = resolveSessionTranscriptsDirForAgent(agentId, env, () => homeDir);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const storePath = resolveStorePath(cfg.session?.store, { agentId });
  fs.mkdirSync(sessionsDir, { recursive: true });
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
}

describe("doctor state integrity oauth dir checks", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let envSnapshot: EnvSnapshot;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  let tempHome = "";

  beforeEach(() => {
    envSnapshot = captureEnv();
    tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-doctor-state-integrity-"));
    process.env.HOME = tempHome;
    process.env.OPENCLAW_HOME = tempHome;
    process.env.OPENCLAW_STATE_DIR = path.join(tempHome, ".openclaw");
    delete process.env.OPENCLAW_OAUTH_DIR;
    fs.mkdirSync(process.env.OPENCLAW_STATE_DIR, { recursive: true, mode: 0o700 });
    vi.mocked(note).mockReset();
  });

  afterEach(() => {
    restoreEnv(envSnapshot);
    fs.rmSync(tempHome, { recursive: true, force: true });
  });

  it("does not prompt for oauth dir when no whatsapp/pairing config is active", async () => {
    const cfg: OpenClawConfig = {};
    setupSessionState(cfg, process.env, tempHome);
    const confirmSkipInNonInteractive = vi.fn(async () => false);

    await noteStateIntegrity(cfg, { confirmSkipInNonInteractive });

    expect(confirmSkipInNonInteractive).not.toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Create OAuth dir at"),
      }),
    );
    const stateIntegrityText = vi
      .mocked(note)
      .mock.calls.filter((call) => call[1] === "State integrity")
      .map((call) => String(call[0]))
      .join("\n");
    expect(stateIntegrityText).toContain("OAuth dir not present");
    expect(stateIntegrityText).not.toContain("CRITICAL: OAuth dir missing");
  });

  it("prompts for oauth dir when whatsapp is configured", async () => {
    const cfg: OpenClawConfig = {
      channels: {
        whatsapp: {},
      },
    };
    setupSessionState(cfg, process.env, tempHome);
    const confirmSkipInNonInteractive = vi.fn(async () => false);

    await noteStateIntegrity(cfg, { confirmSkipInNonInteractive });

    expect(confirmSkipInNonInteractive).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Create OAuth dir at"),
      }),
    );
    const stateIntegrityText = vi
      .mocked(note)
      .mock.calls.filter((call) => call[1] === "State integrity")
      .map((call) => String(call[0]))
      .join("\n");
    expect(stateIntegrityText).toContain("CRITICAL: OAuth dir missing");
  });

  it("prompts for oauth dir when a channel dmPolicy is pairing", async () => {
    const cfg: OpenClawConfig = {
      channels: {
        telegram: {
          dmPolicy: "pairing",
        },
      },
    };
    setupSessionState(cfg, process.env, tempHome);
    const confirmSkipInNonInteractive = vi.fn(async () => false);

    await noteStateIntegrity(cfg, { confirmSkipInNonInteractive });

    expect(confirmSkipInNonInteractive).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Create OAuth dir at"),
      }),
    );
  });
});
