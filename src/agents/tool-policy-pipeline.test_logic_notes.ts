/*
 * AUTO ANNOTATION
 * File: src/agents/tool-policy-pipeline.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, test } from "vitest";
import { applyToolPolicyPipeline } from "./tool-policy-pipeline.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type DummyTool = { name: string };

describe("tool-policy-pipeline", () => {
  test("strips allowlists that would otherwise disable core tools", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tools = [{ name: "exec" }, { name: "plugin_tool" }] as unknown as DummyTool[];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const filtered = applyToolPolicyPipeline({
      // oxlint-disable-next-line typescript/no-explicit-any
      tools: tools as any,
      // oxlint-disable-next-line typescript/no-explicit-any
      toolMeta: (t: any) => (t.name === "plugin_tool" ? { pluginId: "foo" } : undefined),
      warn: () => {},
      steps: [
        {
          policy: { allow: ["plugin_tool"] },
          label: "tools.allow",
          stripPluginOnlyAllowlist: true,
        },
      ],
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const names = filtered.map((t) => (t as unknown as DummyTool).name).toSorted();
    expect(names).toEqual(["exec", "plugin_tool"]);
  });

  test("warns about unknown allowlist entries", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const warnings: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tools = [{ name: "exec" }] as unknown as DummyTool[];
    applyToolPolicyPipeline({
      // oxlint-disable-next-line typescript/no-explicit-any
      tools: tools as any,
      // oxlint-disable-next-line typescript/no-explicit-any
      toolMeta: () => undefined,
      warn: (msg) => warnings.push(msg),
      steps: [
        {
          policy: { allow: ["wat"] },
          label: "tools.allow",
          stripPluginOnlyAllowlist: true,
        },
      ],
    });
    expect(warnings.length).toBe(1);
    expect(warnings[0]).toContain("unknown entries (wat)");
  });

  test("applies allowlist filtering when core tools are explicitly listed", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tools = [{ name: "exec" }, { name: "process" }] as unknown as DummyTool[];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const filtered = applyToolPolicyPipeline({
      // oxlint-disable-next-line typescript/no-explicit-any
      tools: tools as any,
      // oxlint-disable-next-line typescript/no-explicit-any
      toolMeta: () => undefined,
      warn: () => {},
      steps: [
        {
          policy: { allow: ["exec"] },
          label: "tools.allow",
          stripPluginOnlyAllowlist: true,
        },
      ],
    });
    expect(filtered.map((t) => (t as unknown as DummyTool).name)).toEqual(["exec"]);
  });
});
