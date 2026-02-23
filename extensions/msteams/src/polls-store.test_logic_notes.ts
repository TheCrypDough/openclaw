/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/polls-store.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createMSTeamsPollStoreMemory } from "./polls-store-memory.js";
import { createMSTeamsPollStoreFs } from "./polls.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const createFsStore = async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const stateDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "openclaw-msteams-polls-"));
  return createMSTeamsPollStoreFs({ stateDir });
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const createMemoryStore = () => createMSTeamsPollStoreMemory();

describe.each([
  { name: "memory", createStore: createMemoryStore },
  { name: "fs", createStore: createFsStore },
])("$name poll store", ({ createStore }) => {
  it("stores polls and records normalized votes", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const store = await createStore();
    await store.createPoll({
      id: "poll-1",
      question: "Lunch?",
      options: ["Pizza", "Sushi"],
      maxSelections: 1,
      createdAt: new Date().toISOString(),
      votes: {},
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const poll = await store.recordVote({
      pollId: "poll-1",
      voterId: "user-1",
      selections: ["0", "1"],
    });

    expect(poll?.votes["user-1"]).toEqual(["0"]);
  });
});
