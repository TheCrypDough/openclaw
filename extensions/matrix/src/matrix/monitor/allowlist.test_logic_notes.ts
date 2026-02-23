/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/monitor/allowlist.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { normalizeMatrixAllowList, resolveMatrixAllowListMatch } from "./allowlist.js";

describe("resolveMatrixAllowListMatch", () => {
  it("matches full user IDs and prefixes", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const userId = "@Alice:Example.org";
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const direct = resolveMatrixAllowListMatch({
      allowList: normalizeMatrixAllowList(["@alice:example.org"]),
      userId,
    });
    expect(direct.allowed).toBe(true);
    expect(direct.matchSource).toBe("id");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prefixedMatrix = resolveMatrixAllowListMatch({
      allowList: normalizeMatrixAllowList(["matrix:@alice:example.org"]),
      userId,
    });
    expect(prefixedMatrix.allowed).toBe(true);
    expect(prefixedMatrix.matchSource).toBe("prefixed-id");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const prefixedUser = resolveMatrixAllowListMatch({
      allowList: normalizeMatrixAllowList(["user:@alice:example.org"]),
      userId,
    });
    expect(prefixedUser.allowed).toBe(true);
    expect(prefixedUser.matchSource).toBe("prefixed-user");
  });

  it("ignores display names and localparts", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const match = resolveMatrixAllowListMatch({
      allowList: normalizeMatrixAllowList(["alice", "Alice"]),
      userId: "@alice:example.org",
    });
    expect(match.allowed).toBe(false);
  });

  it("matches wildcard", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const match = resolveMatrixAllowListMatch({
      allowList: normalizeMatrixAllowList(["*"]),
      userId: "@alice:example.org",
    });
    expect(match.allowed).toBe(true);
    expect(match.matchSource).toBe("wildcard");
  });
});
