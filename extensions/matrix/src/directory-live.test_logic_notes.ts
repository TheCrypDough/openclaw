/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/directory-live.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { listMatrixDirectoryGroupsLive, listMatrixDirectoryPeersLive } from "./directory-live.js";
import { resolveMatrixAuth } from "./matrix/client.js";

vi.mock("./matrix/client.js", () => ({
  resolveMatrixAuth: vi.fn(),
}));

describe("matrix directory live", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg = { channels: { matrix: {} } };

  beforeEach(() => {
    vi.mocked(resolveMatrixAuth).mockReset();
    vi.mocked(resolveMatrixAuth).mockResolvedValue({
      homeserver: "https://matrix.example.org",
      userId: "@bot:example.org",
      accessToken: "test-token",
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [] }),
        text: async () => "",
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("passes accountId to peer directory auth resolution", async () => {
    await listMatrixDirectoryPeersLive({
      cfg,
      accountId: "assistant",
      query: "alice",
      limit: 10,
    });

    expect(resolveMatrixAuth).toHaveBeenCalledWith({ cfg, accountId: "assistant" });
  });

  it("passes accountId to group directory auth resolution", async () => {
    await listMatrixDirectoryGroupsLive({
      cfg,
      accountId: "assistant",
      query: "!room:example.org",
      limit: 10,
    });

    expect(resolveMatrixAuth).toHaveBeenCalledWith({ cfg, accountId: "assistant" });
  });

  it("returns no peer results for empty query without resolving auth", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await listMatrixDirectoryPeersLive({
      cfg,
      query: "   ",
    });

    expect(result).toEqual([]);
    expect(resolveMatrixAuth).not.toHaveBeenCalled();
  });

  it("returns no group results for empty query without resolving auth", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await listMatrixDirectoryGroupsLive({
      cfg,
      query: "",
    });

    expect(result).toEqual([]);
    expect(resolveMatrixAuth).not.toHaveBeenCalled();
  });
});
