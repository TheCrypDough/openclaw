/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/conversation-store-fs.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { createMSTeamsConversationStoreFs } from "./conversation-store-fs.js";
import type { StoredConversationReference } from "./conversation-store.js";
import { setMSTeamsRuntime } from "./runtime.js";
import { msteamsRuntimeStub } from "./test-runtime.js";

describe("msteams conversation store (fs)", () => {
  beforeEach(() => {
    setMSTeamsRuntime(msteamsRuntimeStub);
  });

  it("filters and prunes expired entries (but keeps legacy ones)", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stateDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "openclaw-msteams-store-"));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      OPENCLAW_STATE_DIR: stateDir,
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const store = createMSTeamsConversationStoreFs({ env, ttlMs: 1_000 });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ref: StoredConversationReference = {
      conversation: { id: "19:active@thread.tacv2" },
      channelId: "msteams",
      serviceUrl: "https://service.example.com",
      user: { id: "u1", aadObjectId: "aad1" },
    };

    await store.upsert("19:active@thread.tacv2", ref);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const filePath = path.join(stateDir, "msteams-conversations.json");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const raw = await fs.promises.readFile(filePath, "utf-8");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const json = JSON.parse(raw) as {
      version: number;
      conversations: Record<string, StoredConversationReference & { lastSeenAt?: string }>;
    };

    json.conversations["19:old@thread.tacv2"] = {
      ...ref,
      conversation: { id: "19:old@thread.tacv2" },
      lastSeenAt: new Date(Date.now() - 60_000).toISOString(),
    };

    // Legacy entry without lastSeenAt should be preserved.
    json.conversations["19:legacy@thread.tacv2"] = {
      ...ref,
      conversation: { id: "19:legacy@thread.tacv2" },
    };

    await fs.promises.writeFile(filePath, `${JSON.stringify(json, null, 2)}\n`);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const list = await store.list();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ids = list.map((e) => e.conversationId).toSorted();
    expect(ids).toEqual(["19:active@thread.tacv2", "19:legacy@thread.tacv2"]);

    expect(await store.get("19:old@thread.tacv2")).toBeNull();
    expect(await store.get("19:legacy@thread.tacv2")).not.toBeNull();

    await store.upsert("19:new@thread.tacv2", {
      ...ref,
      conversation: { id: "19:new@thread.tacv2" },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const rawAfter = await fs.promises.readFile(filePath, "utf-8");
    const jsonAfter = JSON.parse(rawAfter) as typeof json;
    expect(Object.keys(jsonAfter.conversations).toSorted()).toEqual([
      "19:active@thread.tacv2",
      "19:legacy@thread.tacv2",
      "19:new@thread.tacv2",
    ]);
  });
});
