# AUTOPLACEHOLDER_ANNOTATION: src/config/config.sandbox-docker.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { describe, expect, it } from "vitest";
import { resolveSandboxBrowserConfig } from "../agents/sandbox/config.js";
import { validateConfigObject } from "./config.js";

describe("sandbox docker config", () => {
  it("accepts safe binds array in sandbox.docker config", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      agents: {
        defaults: {
          sandbox: {
            docker: {
              binds: ["/home/user/source:/source:rw", "/var/data/myapp:/data:ro"],
            },
          },
        },
        list: [
          {
            id: "main",
            sandbox: {
              docker: {
                image: "custom-sandbox:latest",
                binds: ["/home/user/projects:/projects:ro"],
              },
            },
          },
        ],
      },
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.config.agents?.defaults?.sandbox?.docker?.binds).toEqual([
        "/home/user/source:/source:rw",
        "/var/data/myapp:/data:ro",
      ]);
      expect(res.config.agents?.list?.[0]?.sandbox?.docker?.binds).toEqual([
        "/home/user/projects:/projects:ro",
      ]);
    }
  });

  it("rejects network host mode via Zod schema validation", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      agents: {
        defaults: {
          sandbox: {
            docker: {
              network: "host",
            },
          },
        },
      },
    });
    expect(res.ok).toBe(false);
  });

  it("rejects seccomp unconfined via Zod schema validation", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      agents: {
        defaults: {
          sandbox: {
            docker: {
              seccompProfile: "unconfined",
            },
          },
        },
      },
    });
    expect(res.ok).toBe(false);
  });

  it("rejects apparmor unconfined via Zod schema validation", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      agents: {
        defaults: {
          sandbox: {
            docker: {
              apparmorProfile: "unconfined",
            },
          },
        },
      },
    });
    expect(res.ok).toBe(false);
  });

  it("rejects non-string values in binds array", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      agents: {
        defaults: {
          sandbox: {
            docker: {
              binds: [123, "/valid/path:/path"],
            },
          },
        },
      },
    });
    expect(res.ok).toBe(false);
  });
});

describe("sandbox browser binds config", () => {
  it("accepts binds array in sandbox.browser config", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      agents: {
        defaults: {
          sandbox: {
            browser: {
              binds: ["/home/user/.chrome-profile:/data/chrome:rw"],
            },
          },
        },
      },
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.config.agents?.defaults?.sandbox?.browser?.binds).toEqual([
        "/home/user/.chrome-profile:/data/chrome:rw",
      ]);
    }
  });

  it("rejects non-string values in browser binds array", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      agents: {
        defaults: {
          sandbox: {
            browser: {
              binds: [123],
            },
          },
        },
      },
    });
    expect(res.ok).toBe(false);
  });

  it("merges global and agent browser binds", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = resolveSandboxBrowserConfig({
      scope: "agent",
      globalBrowser: { binds: ["/global:/global:ro"] },
      agentBrowser: { binds: ["/agent:/agent:rw"] },
    });
    expect(resolved.binds).toEqual(["/global:/global:ro", "/agent:/agent:rw"]);
  });

  it("treats empty binds as configured (override to none)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = resolveSandboxBrowserConfig({
      scope: "agent",
      globalBrowser: { binds: [] },
      agentBrowser: {},
    });
    expect(resolved.binds).toEqual([]);
  });

  it("ignores agent browser binds under shared scope", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolved = resolveSandboxBrowserConfig({
      scope: "shared",
      globalBrowser: { binds: ["/global:/global:ro"] },
      agentBrowser: { binds: ["/agent:/agent:rw"] },
    });
    expect(resolved.binds).toEqual(["/global:/global:ro"]);

    const resolvedNoGlobal = resolveSandboxBrowserConfig({
      scope: "shared",
      globalBrowser: {},
      agentBrowser: { binds: ["/agent:/agent:rw"] },
    });
    expect(resolvedNoGlobal.binds).toBeUndefined();
  });

  it("returns undefined binds when none configured", () => {
    const resolved = resolveSandboxBrowserConfig({
      scope: "agent",
      globalBrowser: {},
      agentBrowser: {},
    });
    expect(resolved.binds).toBeUndefined();
  });

  it("defaults browser network to dedicated sandbox network", () => {
    const resolved = resolveSandboxBrowserConfig({
      scope: "agent",
      globalBrowser: {},
      agentBrowser: {},
    });
    expect(resolved.network).toBe("openclaw-sandbox-browser");
  });

  it("prefers agent browser network over global browser network", () => {
    const resolved = resolveSandboxBrowserConfig({
      scope: "agent",
      globalBrowser: { network: "openclaw-sandbox-browser-global" },
      agentBrowser: { network: "openclaw-sandbox-browser-agent" },
    });
    expect(resolved.network).toBe("openclaw-sandbox-browser-agent");
  });

  it("merges cdpSourceRange with agent override", () => {
    const resolved = resolveSandboxBrowserConfig({
      scope: "agent",
      globalBrowser: { cdpSourceRange: "172.21.0.1/32" },
      agentBrowser: { cdpSourceRange: "172.22.0.1/32" },
    });
    expect(resolved.cdpSourceRange).toBe("172.22.0.1/32");
  });

  it("rejects host network mode in sandbox.browser config", () => {
    const res = validateConfigObject({
      agents: {
        defaults: {
          sandbox: {
            browser: {
              network: "host",
            },
          },
        },
      },
    });
    expect(res.ok).toBe(false);
  });
});
