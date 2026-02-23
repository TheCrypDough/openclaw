/*
 * AUTO ANNOTATION
 * File: src/channels/allowlists/resolve-utils.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import {
  addAllowlistUserEntriesFromConfigEntry,
  buildAllowlistResolutionSummary,
  canonicalizeAllowlistWithResolvedIds,
  patchAllowlistUsersInConfigEntries,
} from "./resolve-utils.js";

describe("buildAllowlistResolutionSummary", () => {
  it("returns mapping, additions, and unresolved (including missing ids)", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolvedUsers = [
      { input: "a", resolved: true, id: "1" },
      { input: "b", resolved: false },
      { input: "c", resolved: true },
    ];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = buildAllowlistResolutionSummary(resolvedUsers);
    expect(result.mapping).toEqual(["a→1"]);
    expect(result.additions).toEqual(["1"]);
    expect(result.unresolved).toEqual(["b", "c"]);
  });

  it("supports custom resolved formatting", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolvedUsers = [{ input: "a", resolved: true, id: "1", note: "x" }];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = buildAllowlistResolutionSummary(resolvedUsers, {
      formatResolved: (entry) =>
        `${entry.input}→${entry.id}${(entry as { note?: string }).note ? " (note)" : ""}`,
    });
    expect(result.mapping).toEqual(["a→1 (note)"]);
  });
});

describe("addAllowlistUserEntriesFromConfigEntry", () => {
  it("adds trimmed users and skips '*' and blanks", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const target = new Set<string>();
    addAllowlistUserEntriesFromConfigEntry(target, { users: ["  a  ", "*", "", "b"] });
    expect(Array.from(target).toSorted()).toEqual(["a", "b"]);
  });

  it("ignores non-objects", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const target = new Set<string>(["a"]);
    addAllowlistUserEntriesFromConfigEntry(target, null);
    expect(Array.from(target)).toEqual(["a"]);
  });
});

describe("canonicalizeAllowlistWithResolvedIds", () => {
  it("replaces resolved names with ids and keeps unresolved entries", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolvedMap = new Map([
      ["Alice#1234", { input: "Alice#1234", resolved: true, id: "111" }],
      ["bob", { input: "bob", resolved: false }],
    ]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = canonicalizeAllowlistWithResolvedIds({
      existing: ["Alice#1234", "bob", "222", "*"],
      resolvedMap,
    });
    expect(result).toEqual(["111", "bob", "222", "*"]);
  });

  it("deduplicates ids after canonicalization", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const resolvedMap = new Map([["alice", { input: "alice", resolved: true, id: "111" }]]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = canonicalizeAllowlistWithResolvedIds({
      existing: ["alice", "111", "alice"],
      resolvedMap,
    });
    expect(result).toEqual(["111"]);
  });
});

describe("patchAllowlistUsersInConfigEntries", () => {
  it("supports canonicalization strategy for nested users", () => {
    const entries = {
      alpha: { users: ["Alice", "111", "Bob"] },
      beta: { users: ["*"] },
    };
    const resolvedMap = new Map([
      ["Alice", { input: "Alice", resolved: true, id: "111" }],
      ["Bob", { input: "Bob", resolved: false }],
    ]);
    const patched = patchAllowlistUsersInConfigEntries({
      entries,
      resolvedMap,
      strategy: "canonicalize",
    });
    expect((patched.alpha as { users: string[] }).users).toEqual(["111", "Bob"]);
    expect((patched.beta as { users: string[] }).users).toEqual(["*"]);
  });
});
