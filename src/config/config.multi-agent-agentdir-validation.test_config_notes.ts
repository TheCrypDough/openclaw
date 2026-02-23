# AUTOPLACEHOLDER_ANNOTATION: src/config/config.multi-agent-agentdir-validation.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import fs from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { loadConfig, validateConfigObject } from "./config.js";
import { withTempHome } from "./test-helpers.js";

describe("multi-agent agentDir validation", () => {
  it("rejects shared agents.list agentDir", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const shared = path.join(tmpdir(), "openclaw-shared-agentdir");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      agents: {
        list: [
          { id: "a", agentDir: shared },
          { id: "b", agentDir: shared },
        ],
      },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues.some((i) => i.path === "agents.list")).toBe(true);
      expect(res.issues[0]?.message).toContain("Duplicate agentDir");
    }
  });

  it("throws on shared agentDir during loadConfig()", async () => {
    await withTempHome(async (home) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const configDir = path.join(home, ".openclaw");
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(
        path.join(configDir, "openclaw.json"),
        JSON.stringify(
          {
            agents: {
              list: [
                { id: "a", agentDir: "~/.openclaw/agents/shared/agent" },
                { id: "b", agentDir: "~/.openclaw/agents/shared/agent" },
              ],
            },
            bindings: [{ agentId: "a", match: { channel: "telegram" } }],
          },
          null,
          2,
        ),
        "utf-8",
      );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => loadConfig()).toThrow(/duplicate agentDir/i);
      expect(spy.mock.calls.flat().join(" ")).toMatch(/Duplicate agentDir/i);
      spy.mockRestore();
    });
  });
});
