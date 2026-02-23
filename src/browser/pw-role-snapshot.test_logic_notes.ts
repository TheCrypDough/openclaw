/*
 * AUTO ANNOTATION
 * File: src/browser/pw-role-snapshot.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import {
  buildRoleSnapshotFromAiSnapshot,
  buildRoleSnapshotFromAriaSnapshot,
  getRoleSnapshotStats,
  parseRoleRef,
} from "./pw-role-snapshot.js";

describe("pw-role-snapshot", () => {
  it("adds refs for interactive elements", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const aria = [
      '- heading "Example" [level=1]',
      "- paragraph: hello",
      '- button "Submit"',
      "  - generic",
      '- link "Learn more"',
    ].join("\n");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = buildRoleSnapshotFromAriaSnapshot(aria, { interactive: true });
    expect(res.snapshot).toContain("[ref=e1]");
    expect(res.snapshot).toContain("[ref=e2]");
    expect(res.snapshot).toContain('- button "Submit" [ref=e1]');
    expect(res.snapshot).toContain('- link "Learn more" [ref=e2]');
    expect(Object.keys(res.refs)).toEqual(["e1", "e2"]);
    expect(res.refs.e1).toMatchObject({ role: "button", name: "Submit" });
    expect(res.refs.e2).toMatchObject({ role: "link", name: "Learn more" });
  });

  it("uses nth only when duplicates exist", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const aria = ['- button "OK"', '- button "OK"', '- button "Cancel"'].join("\n");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = buildRoleSnapshotFromAriaSnapshot(aria);
    expect(res.snapshot).toContain("[ref=e1]");
    expect(res.snapshot).toContain("[ref=e2] [nth=1]");
    expect(res.refs.e1?.nth).toBe(0);
    expect(res.refs.e2?.nth).toBe(1);
    expect(res.refs.e3?.nth).toBeUndefined();
  });
  it("respects maxDepth", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const aria = ['- region "Main"', "  - group", '    - button "Deep"'].join("\n");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = buildRoleSnapshotFromAriaSnapshot(aria, { maxDepth: 1 });
    expect(res.snapshot).toContain('- region "Main"');
    expect(res.snapshot).toContain("  - group");
    expect(res.snapshot).not.toContain("button");
  });

  it("computes stats", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const aria = ['- button "OK"', '- button "Cancel"'].join("\n");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = buildRoleSnapshotFromAriaSnapshot(aria);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stats = getRoleSnapshotStats(res.snapshot, res.refs);
    expect(stats.refs).toBe(2);
    expect(stats.interactive).toBe(2);
    expect(stats.lines).toBeGreaterThan(0);
    expect(stats.chars).toBeGreaterThan(0);
  });

  it("returns a helpful message when no interactive elements exist", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const aria = ['- heading "Hello"', "- paragraph: world"].join("\n");
    const res = buildRoleSnapshotFromAriaSnapshot(aria, { interactive: true });
    expect(res.snapshot).toBe("(no interactive elements)");
    expect(Object.keys(res.refs)).toEqual([]);
  });

  it("parses role refs", () => {
    expect(parseRoleRef("e12")).toBe("e12");
    expect(parseRoleRef("@e12")).toBe("e12");
    expect(parseRoleRef("ref=e12")).toBe("e12");
    expect(parseRoleRef("12")).toBeNull();
    expect(parseRoleRef("")).toBeNull();
  });

  it("preserves Playwright aria-ref ids in ai snapshots", () => {
    const ai = [
      "- navigation [ref=e1]:",
      '  - link "Home" [ref=e5]',
      '  - heading "Title" [ref=e6]',
      '  - button "Save" [ref=e7] [cursor=pointer]:',
      "  - paragraph: hello",
    ].join("\n");

    const res = buildRoleSnapshotFromAiSnapshot(ai, { interactive: true });
    expect(res.snapshot).toContain("[ref=e5]");
    expect(res.snapshot).toContain('- link "Home"');
    expect(res.snapshot).toContain('- button "Save"');
    expect(res.snapshot).not.toContain("navigation");
    expect(res.snapshot).not.toContain("heading");
    expect(Object.keys(res.refs).toSorted()).toEqual(["e5", "e7"]);
    expect(res.refs.e5).toMatchObject({ role: "link", name: "Home" });
    expect(res.refs.e7).toMatchObject({ role: "button", name: "Save" });
  });
});
