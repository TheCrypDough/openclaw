/*
 * AUTO ANNOTATION
 * File: extensions/zalouser/src/status-issues.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { collectZalouserStatusIssues } from "./status-issues.js";

describe("collectZalouserStatusIssues", () => {
  it("flags missing zca when configured is false", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const issues = collectZalouserStatusIssues([
      {
        accountId: "default",
        enabled: true,
        configured: false,
        lastError: "zca CLI not found in PATH",
      },
    ]);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.kind).toBe("runtime");
    expect(issues[0]?.message).toMatch(/zca CLI not found/i);
  });

  it("flags missing auth when configured is false", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const issues = collectZalouserStatusIssues([
      {
        accountId: "default",
        enabled: true,
        configured: false,
        lastError: "not authenticated",
      },
    ]);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.kind).toBe("auth");
    expect(issues[0]?.message).toMatch(/Not authenticated/i);
  });

  it("warns when dmPolicy is open", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const issues = collectZalouserStatusIssues([
      {
        accountId: "default",
        enabled: true,
        configured: true,
        dmPolicy: "open",
      },
    ]);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.kind).toBe("config");
  });

  it("skips disabled accounts", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const issues = collectZalouserStatusIssues([
      {
        accountId: "default",
        enabled: false,
        configured: false,
        lastError: "zca CLI not found in PATH",
      },
    ]);
    expect(issues).toHaveLength(0);
  });
});
