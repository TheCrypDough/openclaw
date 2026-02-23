/*
 * AUTO ANNOTATION
 * File: src/agents/sandbox-create-args.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { buildSandboxCreateArgs, type SandboxDockerConfig } from "./sandbox.js";

describe("buildSandboxCreateArgs", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function createSandboxConfig(
    overrides: Partial<SandboxDockerConfig> = {},
    binds?: string[],
  ): SandboxDockerConfig {
    return {
      image: "openclaw-sandbox:bookworm-slim",
      containerPrefix: "openclaw-sbx-",
      workdir: "/workspace",
      readOnlyRoot: false,
      tmpfs: [],
      network: "none",
      capDrop: [],
      ...(binds ? { binds } : {}),
      ...overrides,
    };
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function expectBuildToThrow(
    name: string,
    cfg: SandboxDockerConfig,
    expectedMessage: RegExp,
  ): void {
    expect(
      () =>
        buildSandboxCreateArgs({
          name,
          cfg,
          scopeKey: "main",
          createdAtMs: 1700000000000,
        }),
      name,
    ).toThrow(expectedMessage);
  }

  it("includes hardening and resource flags", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: SandboxDockerConfig = {
      image: "openclaw-sandbox:bookworm-slim",
      containerPrefix: "openclaw-sbx-",
      workdir: "/workspace",
      readOnlyRoot: true,
      tmpfs: ["/tmp"],
      network: "none",
      user: "1000:1000",
      capDrop: ["ALL"],
      env: { LANG: "C.UTF-8" },
      pidsLimit: 256,
      memory: "512m",
      memorySwap: 1024,
      cpus: 1.5,
      ulimits: {
        nofile: { soft: 1024, hard: 2048 },
        nproc: 128,
        core: "0",
      },
      seccompProfile: "/tmp/seccomp.json",
      apparmorProfile: "openclaw-sandbox",
      dns: ["1.1.1.1"],
      extraHosts: ["internal.service:10.0.0.5"],
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const args = buildSandboxCreateArgs({
      name: "openclaw-sbx-test",
      cfg,
      scopeKey: "main",
      createdAtMs: 1700000000000,
      labels: { "openclaw.sandboxBrowser": "1" },
    });

    expect(args).toEqual(
      expect.arrayContaining([
        "create",
        "--name",
        "openclaw-sbx-test",
        "--label",
        "openclaw.sandbox=1",
        "--label",
        "openclaw.sessionKey=main",
        "--label",
        "openclaw.createdAtMs=1700000000000",
        "--label",
        "openclaw.sandboxBrowser=1",
        "--read-only",
        "--tmpfs",
        "/tmp",
        "--network",
        "none",
        "--user",
        "1000:1000",
        "--cap-drop",
        "ALL",
        "--security-opt",
        "no-new-privileges",
        "--security-opt",
        "seccomp=/tmp/seccomp.json",
        "--security-opt",
        "apparmor=openclaw-sandbox",
        "--dns",
        "1.1.1.1",
        "--add-host",
        "internal.service:10.0.0.5",
        "--pids-limit",
        "256",
        "--memory",
        "512m",
        "--memory-swap",
        "1024",
        "--cpus",
        "1.5",
      ]),
    );
    expect(args).toEqual(expect.arrayContaining(["--env", "LANG=C.UTF-8"]));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ulimitValues: string[] = [];
    for (let i = 0; i < args.length; i += 1) {
      if (args[i] === "--ulimit") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const value = args[i + 1];
        if (value) {
          ulimitValues.push(value);
        }
      }
    }
    expect(ulimitValues).toEqual(
      expect.arrayContaining(["nofile=1024:2048", "nproc=128", "core=0"]),
    );
  });

  it("emits -v flags for safe custom binds", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const cfg: SandboxDockerConfig = {
      image: "openclaw-sandbox:bookworm-slim",
      containerPrefix: "openclaw-sbx-",
      workdir: "/workspace",
      readOnlyRoot: false,
      tmpfs: [],
      network: "none",
      capDrop: [],
      binds: ["/home/user/source:/source:rw", "/var/data/myapp:/data:ro"],
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const args = buildSandboxCreateArgs({
      name: "openclaw-sbx-binds",
      cfg,
      scopeKey: "main",
      createdAtMs: 1700000000000,
    });

    expect(args).toContain("-v");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const vFlags: string[] = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "-v") {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const value = args[i + 1];
        if (value) {
          vFlags.push(value);
        }
      }
    }
    expect(vFlags).toContain("/home/user/source:/source:rw");
    expect(vFlags).toContain("/var/data/myapp:/data:ro");
  });

  it.each([
    {
      name: "dangerous Docker socket bind mounts",
      containerName: "openclaw-sbx-dangerous",
      cfg: createSandboxConfig({}, ["/var/run/docker.sock:/var/run/docker.sock"]),
      expected: /blocked path/,
    },
    {
      name: "dangerous parent bind mounts",
      containerName: "openclaw-sbx-dangerous-parent",
      cfg: createSandboxConfig({}, ["/run:/run"]),
      expected: /blocked path/,
    },
    {
      name: "network host mode",
      containerName: "openclaw-sbx-host",
      cfg: createSandboxConfig({ network: "host" }),
      expected: /network mode "host" is blocked/,
    },
    {
      name: "seccomp unconfined",
      containerName: "openclaw-sbx-seccomp",
      cfg: createSandboxConfig({ seccompProfile: "unconfined" }),
      expected: /seccomp profile "unconfined" is blocked/,
    },
    {
      name: "apparmor unconfined",
      containerName: "openclaw-sbx-apparmor",
      cfg: createSandboxConfig({ apparmorProfile: "unconfined" }),
      expected: /apparmor profile "unconfined" is blocked/,
    },
  ])("throws on $name", ({ containerName, cfg, expected }) => {
    expectBuildToThrow(containerName, cfg, expected);
  });

  it("omits -v flags when binds is empty or undefined", () => {
    const cfg: SandboxDockerConfig = {
      image: "openclaw-sandbox:bookworm-slim",
      containerPrefix: "openclaw-sbx-",
      workdir: "/workspace",
      readOnlyRoot: false,
      tmpfs: [],
      network: "none",
      capDrop: [],
      binds: [],
    };

    const args = buildSandboxCreateArgs({
      name: "openclaw-sbx-no-binds",
      cfg,
      scopeKey: "main",
      createdAtMs: 1700000000000,
    });

    // Count -v flags that are NOT workspace mounts (workspace mounts are internal)
    const customVFlags: string[] = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "-v") {
        const value = args[i + 1];
        if (value && !value.includes("/workspace")) {
          customVFlags.push(value);
        }
      }
    }
    expect(customVFlags).toHaveLength(0);
  });
});
