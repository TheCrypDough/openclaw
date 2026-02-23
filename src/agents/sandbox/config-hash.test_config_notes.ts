# AUTOPLACEHOLDER_ANNOTATION: src/agents/sandbox/config-hash.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { describe, expect, it } from "vitest";
import { computeSandboxBrowserConfigHash, computeSandboxConfigHash } from "./config-hash.js";
import type { SandboxDockerConfig } from "./types.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createDockerConfig(overrides?: Partial<SandboxDockerConfig>): SandboxDockerConfig {
  return {
    image: "openclaw-sandbox:test",
    containerPrefix: "openclaw-sbx-",
    workdir: "/workspace",
    readOnlyRoot: true,
    tmpfs: ["/tmp", "/var/tmp", "/run"],
    network: "none",
    capDrop: ["ALL"],
    env: { LANG: "C.UTF-8" },
    dns: ["1.1.1.1", "8.8.8.8"],
    extraHosts: ["host.docker.internal:host-gateway"],
    binds: ["/tmp/workspace:/workspace:rw", "/tmp/cache:/cache:ro"],
    ...overrides,
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DockerArrayField = "tmpfs" | "capDrop" | "dns" | "extraHosts" | "binds";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const ORDER_SENSITIVE_ARRAY_CASES: ReadonlyArray<{
  field: DockerArrayField;
  before: string[];
  after: string[];
}> = [
  {
    field: "tmpfs",
    before: ["/tmp", "/var/tmp", "/run"],
    after: ["/run", "/var/tmp", "/tmp"],
  },
  {
    field: "capDrop",
    before: ["ALL", "CHOWN"],
    after: ["CHOWN", "ALL"],
  },
  {
    field: "dns",
    before: ["1.1.1.1", "8.8.8.8"],
    after: ["8.8.8.8", "1.1.1.1"],
  },
  {
    field: "extraHosts",
    before: ["host.docker.internal:host-gateway", "db.local:10.0.0.5"],
    after: ["db.local:10.0.0.5", "host.docker.internal:host-gateway"],
  },
  {
    field: "binds",
    before: ["/tmp/workspace:/workspace:rw", "/tmp/cache:/cache:ro"],
    after: ["/tmp/cache:/cache:ro", "/tmp/workspace:/workspace:rw"],
  },
];

describe("computeSandboxConfigHash", () => {
  it("ignores object key order", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const shared = {
      workspaceAccess: "rw" as const,
      workspaceDir: "/tmp/workspace",
      agentWorkspaceDir: "/tmp/workspace",
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const left = computeSandboxConfigHash({
      ...shared,
      docker: createDockerConfig({
        env: {
          LANG: "C.UTF-8",
          B: "2",
          A: "1",
        },
      }),
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const right = computeSandboxConfigHash({
      ...shared,
      docker: createDockerConfig({
        env: {
          A: "1",
          B: "2",
          LANG: "C.UTF-8",
        },
      }),
    });
    expect(left).toBe(right);
  });

  it.each(ORDER_SENSITIVE_ARRAY_CASES)("treats $field order as significant", (testCase) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const shared = {
      workspaceAccess: "rw" as const,
      workspaceDir: "/tmp/workspace",
      agentWorkspaceDir: "/tmp/workspace",
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const left = computeSandboxConfigHash({
      ...shared,
      docker: createDockerConfig({
        [testCase.field]: testCase.before,
      } as Partial<SandboxDockerConfig>),
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const right = computeSandboxConfigHash({
      ...shared,
      docker: createDockerConfig({
        [testCase.field]: testCase.after,
      } as Partial<SandboxDockerConfig>),
    });
    expect(left).not.toBe(right);
  });
});

describe("computeSandboxBrowserConfigHash", () => {
  it("treats docker bind order as significant", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const shared = {
      browser: {
        cdpPort: 9222,
        cdpSourceRange: undefined,
        vncPort: 5900,
        noVncPort: 6080,
        headless: false,
        enableNoVnc: true,
      },
      securityEpoch: "epoch-v1",
      workspaceAccess: "rw" as const,
      workspaceDir: "/tmp/workspace",
      agentWorkspaceDir: "/tmp/workspace",
    };
    const left = computeSandboxBrowserConfigHash({
      ...shared,
      docker: createDockerConfig({
        binds: ["/tmp/workspace:/workspace:rw", "/tmp/cache:/cache:ro"],
      }),
    });
    const right = computeSandboxBrowserConfigHash({
      ...shared,
      docker: createDockerConfig({
        binds: ["/tmp/cache:/cache:ro", "/tmp/workspace:/workspace:rw"],
      }),
    });
    expect(left).not.toBe(right);
  });

  it("changes when security epoch changes", () => {
    const shared = {
      docker: createDockerConfig(),
      browser: {
        cdpPort: 9222,
        cdpSourceRange: undefined,
        vncPort: 5900,
        noVncPort: 6080,
        headless: false,
        enableNoVnc: true,
      },
      workspaceAccess: "rw" as const,
      workspaceDir: "/tmp/workspace",
      agentWorkspaceDir: "/tmp/workspace",
    };
    const left = computeSandboxBrowserConfigHash({
      ...shared,
      securityEpoch: "epoch-v1",
    });
    const right = computeSandboxBrowserConfigHash({
      ...shared,
      securityEpoch: "epoch-v2",
    });
    expect(left).not.toBe(right);
  });

  it("changes when cdp source range changes", () => {
    const shared = {
      docker: createDockerConfig(),
      browser: {
        cdpPort: 9222,
        vncPort: 5900,
        noVncPort: 6080,
        headless: false,
        enableNoVnc: true,
      },
      securityEpoch: "epoch-v1",
      workspaceAccess: "rw" as const,
      workspaceDir: "/tmp/workspace",
      agentWorkspaceDir: "/tmp/workspace",
    };
    const left = computeSandboxBrowserConfigHash({
      ...shared,
      browser: { ...shared.browser, cdpSourceRange: "172.21.0.1/32" },
    });
    const right = computeSandboxBrowserConfigHash({
      ...shared,
      browser: { ...shared.browser, cdpSourceRange: "172.22.0.1/32" },
    });
    expect(left).not.toBe(right);
  });
});
