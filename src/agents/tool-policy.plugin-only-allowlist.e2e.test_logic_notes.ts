/*
 * AUTO ANNOTATION
 * File: src/agents/tool-policy.plugin-only-allowlist.e2e.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { stripPluginOnlyAllowlist, type PluginToolGroups } from "./tool-policy.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const pluginGroups: PluginToolGroups = {
  all: ["lobster", "workflow_tool"],
  byPlugin: new Map([["lobster", ["lobster", "workflow_tool"]]]),
};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const coreTools = new Set(["read", "write", "exec", "session_status"]);

describe("stripPluginOnlyAllowlist", () => {
  it("strips allowlist when it only targets plugin tools", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const policy = stripPluginOnlyAllowlist({ allow: ["lobster"] }, pluginGroups, coreTools);
    expect(policy.policy?.allow).toBeUndefined();
    expect(policy.unknownAllowlist).toEqual([]);
  });

  it("strips allowlist when it only targets plugin groups", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const policy = stripPluginOnlyAllowlist({ allow: ["group:plugins"] }, pluginGroups, coreTools);
    expect(policy.policy?.allow).toBeUndefined();
    expect(policy.unknownAllowlist).toEqual([]);
  });

  it('keeps allowlist when it uses "*"', () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const policy = stripPluginOnlyAllowlist({ allow: ["*"] }, pluginGroups, coreTools);
    expect(policy.policy?.allow).toEqual(["*"]);
    expect(policy.unknownAllowlist).toEqual([]);
  });

  it("keeps allowlist when it mixes plugin and core entries", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const policy = stripPluginOnlyAllowlist(
      { allow: ["lobster", "read"] },
      pluginGroups,
      coreTools,
    );
    expect(policy.policy?.allow).toEqual(["lobster", "read"]);
    expect(policy.unknownAllowlist).toEqual([]);
  });

  it("strips allowlist with unknown entries when no core tools match", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const emptyPlugins: PluginToolGroups = { all: [], byPlugin: new Map() };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const policy = stripPluginOnlyAllowlist({ allow: ["lobster"] }, emptyPlugins, coreTools);
    expect(policy.policy?.allow).toBeUndefined();
    expect(policy.unknownAllowlist).toEqual(["lobster"]);
  });

  it("keeps allowlist with core tools and reports unknown entries", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const emptyPlugins: PluginToolGroups = { all: [], byPlugin: new Map() };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const policy = stripPluginOnlyAllowlist(
      { allow: ["read", "lobster"] },
      emptyPlugins,
      coreTools,
    );
    expect(policy.policy?.allow).toEqual(["read", "lobster"]);
    expect(policy.unknownAllowlist).toEqual(["lobster"]);
  });
});
