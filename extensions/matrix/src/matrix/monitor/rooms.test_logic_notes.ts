/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/monitor/rooms.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { resolveMatrixRoomConfig } from "./rooms.js";

describe("resolveMatrixRoomConfig", () => {
  it("matches room IDs and aliases, not names", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rooms = {
      "!room:example.org": { allow: true },
      "#alias:example.org": { allow: true },
      "Project Room": { allow: true },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const byId = resolveMatrixRoomConfig({
      rooms,
      roomId: "!room:example.org",
      aliases: [],
      name: "Project Room",
    });
    expect(byId.allowed).toBe(true);
    expect(byId.matchKey).toBe("!room:example.org");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const byAlias = resolveMatrixRoomConfig({
      rooms,
      roomId: "!other:example.org",
      aliases: ["#alias:example.org"],
      name: "Other Room",
    });
    expect(byAlias.allowed).toBe(true);
    expect(byAlias.matchKey).toBe("#alias:example.org");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const byName = resolveMatrixRoomConfig({
      rooms: { "Project Room": { allow: true } },
      roomId: "!different:example.org",
      aliases: [],
      name: "Project Room",
    });
    expect(byName.allowed).toBe(false);
    expect(byName.config).toBeUndefined();
  });
});
