/*
 * AUTO ANNOTATION
 * File: src/daemon/service-audit.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import {
  auditGatewayServiceConfig,
  checkTokenDrift,
  SERVICE_AUDIT_CODES,
} from "./service-audit.js";
import { buildMinimalServicePath } from "./service-env.js";

describe("auditGatewayServiceConfig", () => {
  it("flags bun runtime", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const audit = await auditGatewayServiceConfig({
      env: { HOME: "/tmp" },
      platform: "darwin",
      command: {
        programArguments: ["/opt/homebrew/bin/bun", "gateway"],
        environment: { PATH: "/usr/bin:/bin" },
      },
    });
    expect(audit.issues.some((issue) => issue.code === SERVICE_AUDIT_CODES.gatewayRuntimeBun)).toBe(
      true,
    );
  });

  it("flags version-managed node paths", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const audit = await auditGatewayServiceConfig({
      env: { HOME: "/tmp" },
      platform: "darwin",
      command: {
        programArguments: ["/Users/test/.nvm/versions/node/v22.0.0/bin/node", "gateway"],
        environment: {
          PATH: "/usr/bin:/bin:/Users/test/.nvm/versions/node/v22.0.0/bin",
        },
      },
    });
    expect(
      audit.issues.some(
        (issue) => issue.code === SERVICE_AUDIT_CODES.gatewayRuntimeNodeVersionManager,
      ),
    ).toBe(true);
    expect(
      audit.issues.some((issue) => issue.code === SERVICE_AUDIT_CODES.gatewayPathNonMinimal),
    ).toBe(true);
    expect(
      audit.issues.some((issue) => issue.code === SERVICE_AUDIT_CODES.gatewayPathMissingDirs),
    ).toBe(true);
  });

  it("accepts Linux minimal PATH with user directories", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const env = { HOME: "/home/testuser", PNPM_HOME: "/opt/pnpm" };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const minimalPath = buildMinimalServicePath({ platform: "linux", env });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const audit = await auditGatewayServiceConfig({
      env,
      platform: "linux",
      command: {
        programArguments: ["/usr/bin/node", "gateway"],
        environment: { PATH: minimalPath },
      },
    });

    expect(
      audit.issues.some((issue) => issue.code === SERVICE_AUDIT_CODES.gatewayPathNonMinimal),
    ).toBe(false);
    expect(
      audit.issues.some((issue) => issue.code === SERVICE_AUDIT_CODES.gatewayPathMissingDirs),
    ).toBe(false);
  });

  it("flags gateway token mismatch when service token is stale", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const audit = await auditGatewayServiceConfig({
      env: { HOME: "/tmp" },
      platform: "linux",
      expectedGatewayToken: "new-token",
      command: {
        programArguments: ["/usr/bin/node", "gateway"],
        environment: {
          PATH: "/usr/local/bin:/usr/bin:/bin",
          OPENCLAW_GATEWAY_TOKEN: "old-token",
        },
      },
    });
    expect(
      audit.issues.some((issue) => issue.code === SERVICE_AUDIT_CODES.gatewayTokenMismatch),
    ).toBe(true);
  });

  it("does not flag gateway token mismatch when service token matches config token", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const audit = await auditGatewayServiceConfig({
      env: { HOME: "/tmp" },
      platform: "linux",
      expectedGatewayToken: "new-token",
      command: {
        programArguments: ["/usr/bin/node", "gateway"],
        environment: {
          PATH: "/usr/local/bin:/usr/bin:/bin",
          OPENCLAW_GATEWAY_TOKEN: "new-token",
        },
      },
    });
    expect(
      audit.issues.some((issue) => issue.code === SERVICE_AUDIT_CODES.gatewayTokenMismatch),
    ).toBe(false);
  });
});

describe("checkTokenDrift", () => {
  it("returns null when both tokens are undefined", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = checkTokenDrift({ serviceToken: undefined, configToken: undefined });
    expect(result).toBeNull();
  });

  it("returns null when both tokens are empty strings", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = checkTokenDrift({ serviceToken: "", configToken: "" });
    expect(result).toBeNull();
  });

  it("returns null when tokens match", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = checkTokenDrift({ serviceToken: "same-token", configToken: "same-token" });
    expect(result).toBeNull();
  });

  it("detects drift when config has token but service has different token", () => {
    const result = checkTokenDrift({ serviceToken: "old-token", configToken: "new-token" });
    expect(result).not.toBeNull();
    expect(result?.code).toBe(SERVICE_AUDIT_CODES.gatewayTokenDrift);
    expect(result?.message).toContain("differs from service token");
  });

  it("detects drift when config has token but service has no token", () => {
    const result = checkTokenDrift({ serviceToken: undefined, configToken: "new-token" });
    expect(result).not.toBeNull();
    expect(result?.code).toBe(SERVICE_AUDIT_CODES.gatewayTokenDrift);
  });

  it("returns null when service has token but config does not", () => {
    // This is not really drift - service will work, just config is incomplete
    const result = checkTokenDrift({ serviceToken: "service-token", configToken: undefined });
    expect(result).toBeNull();
  });
});
