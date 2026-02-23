/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/polls.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { buildMSTeamsPollCard, createMSTeamsPollStoreFs, extractMSTeamsPollVote } from "./polls.js";
import { setMSTeamsRuntime } from "./runtime.js";
import { msteamsRuntimeStub } from "./test-runtime.js";

describe("msteams polls", () => {
  beforeEach(() => {
    setMSTeamsRuntime(msteamsRuntimeStub);
  });

  it("builds poll cards with fallback text", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const card = buildMSTeamsPollCard({
      question: "Lunch?",
      options: ["Pizza", "Sushi"],
    });

    expect(card.pollId).toBeTruthy();
    expect(card.fallbackText).toContain("Poll: Lunch?");
    expect(card.fallbackText).toContain("1. Pizza");
    expect(card.fallbackText).toContain("2. Sushi");
  });

  it("extracts poll votes from activity values", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const vote = extractMSTeamsPollVote({
      value: {
        openclawPollId: "poll-1",
        choices: "0,1",
      },
    });

    expect(vote).toEqual({
      pollId: "poll-1",
      selections: ["0", "1"],
    });
  });

  it("stores and records poll votes", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const home = await fs.promises.mkdtemp(path.join(os.tmpdir(), "openclaw-msteams-polls-"));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const store = createMSTeamsPollStoreFs({ homedir: () => home });
    await store.createPoll({
      id: "poll-2",
      question: "Pick one",
      options: ["A", "B"],
      maxSelections: 1,
      createdAt: new Date().toISOString(),
      votes: {},
    });
    await store.recordVote({
      pollId: "poll-2",
      voterId: "user-1",
      selections: ["0", "1"],
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stored = await store.getPoll("poll-2");
    expect(stored?.votes["user-1"]).toEqual(["0"]);
  });
});
