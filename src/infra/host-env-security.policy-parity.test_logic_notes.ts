/*
 * AUTO ANNOTATION
 * File: src/infra/host-env-security.policy-parity.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type HostEnvSecurityPolicy = {
  blockedKeys: string[];
  blockedPrefixes: string[];
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function parseSwiftStringArray(source: string, marker: string): string[] {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const re = new RegExp(`${escapedMarker}[\\s\\S]*?=\\s*\\[([\\s\\S]*?)\\]`, "m");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const match = source.match(re);
  if (!match) {
    throw new Error(`Failed to parse Swift array for marker: ${marker}`);
  }
  return Array.from(match[1].matchAll(/"([^"]+)"/g), (m) => m[1]);
}

describe("host env security policy parity", () => {
  it("keeps macOS HostEnvSanitizer lists in sync with shared JSON policy", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const repoRoot = process.cwd();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const policyPath = path.join(repoRoot, "src/infra/host-env-security-policy.json");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const swiftPath = path.join(repoRoot, "apps/macos/Sources/OpenClaw/HostEnvSanitizer.swift");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const policy = JSON.parse(fs.readFileSync(policyPath, "utf8")) as HostEnvSecurityPolicy;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const swiftSource = fs.readFileSync(swiftPath, "utf8");

    const swiftBlockedKeys = parseSwiftStringArray(swiftSource, "private static let blockedKeys");
    const swiftBlockedPrefixes = parseSwiftStringArray(
      swiftSource,
      "private static let blockedPrefixes",
    );

    expect(swiftBlockedKeys).toEqual(policy.blockedKeys);
    expect(swiftBlockedPrefixes).toEqual(policy.blockedPrefixes);
  });
});
