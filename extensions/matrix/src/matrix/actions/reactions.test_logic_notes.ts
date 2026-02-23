/*
 * AUTO ANNOTATION
 * File: extensions/matrix/src/matrix/actions/reactions.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { MatrixClient } from "@vector-im/matrix-bot-sdk";
import { describe, expect, it, vi } from "vitest";
import { listMatrixReactions, removeMatrixReactions } from "./reactions.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createReactionsClient(params: {
  chunk: Array<{
    event_id?: string;
    sender?: string;
    key?: string;
  }>;
  userId?: string | null;
}) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const doRequest = vi.fn(async (_method: string, _path: string, _query: any) => ({
    chunk: params.chunk.map((item) => ({
      event_id: item.event_id ?? "",
      sender: item.sender ?? "",
      content: item.key
        ? {
            "m.relates_to": {
              rel_type: "m.annotation",
              event_id: "$target",
              key: item.key,
            },
          }
        : {},
    })),
  }));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const getUserId = vi.fn(async () => params.userId ?? null);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const redactEvent = vi.fn(async () => undefined);

  return {
    client: {
      doRequest,
      getUserId,
      redactEvent,
      stop: vi.fn(),
    } as unknown as MatrixClient,
    doRequest,
    redactEvent,
  };
}

describe("matrix reaction actions", () => {
  it("aggregates reactions by key and unique sender", async () => {
    const { client, doRequest } = createReactionsClient({
      chunk: [
        { event_id: "$1", sender: "@alice:example.org", key: "👍" },
        { event_id: "$2", sender: "@bob:example.org", key: "👍" },
        { event_id: "$3", sender: "@alice:example.org", key: "👎" },
        { event_id: "$4", sender: "@bot:example.org" },
      ],
      userId: "@bot:example.org",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await listMatrixReactions("!room:example.org", "$msg", { client, limit: 2.9 });

    expect(doRequest).toHaveBeenCalledWith(
      "GET",
      expect.stringContaining("/rooms/!room%3Aexample.org/relations/%24msg/"),
      expect.objectContaining({ limit: 2 }),
    );
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "👍",
          count: 2,
          users: expect.arrayContaining(["@alice:example.org", "@bob:example.org"]),
        }),
        expect.objectContaining({
          key: "👎",
          count: 1,
          users: ["@alice:example.org"],
        }),
      ]),
    );
  });

  it("removes only current-user reactions matching emoji filter", async () => {
    const { client, redactEvent } = createReactionsClient({
      chunk: [
        { event_id: "$1", sender: "@me:example.org", key: "👍" },
        { event_id: "$2", sender: "@me:example.org", key: "👎" },
        { event_id: "$3", sender: "@other:example.org", key: "👍" },
      ],
      userId: "@me:example.org",
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await removeMatrixReactions("!room:example.org", "$msg", {
      client,
      emoji: "👍",
    });

    expect(result).toEqual({ removed: 1 });
    expect(redactEvent).toHaveBeenCalledTimes(1);
    expect(redactEvent).toHaveBeenCalledWith("!room:example.org", "$1");
  });

  it("returns removed=0 when current user id is unavailable", async () => {
    const { client, redactEvent } = createReactionsClient({
      chunk: [{ event_id: "$1", sender: "@me:example.org", key: "👍" }],
      userId: null,
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = await removeMatrixReactions("!room:example.org", "$msg", { client });

    expect(result).toEqual({ removed: 0 });
    expect(redactEvent).not.toHaveBeenCalled();
  });
});
