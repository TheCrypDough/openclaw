/*
 * AUTO ANNOTATION
 * File: extensions/msteams/src/polls-store-memory.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import {
  type MSTeamsPoll,
  type MSTeamsPollStore,
  normalizeMSTeamsPollSelections,
} from "./polls.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function createMSTeamsPollStoreMemory(initial: MSTeamsPoll[] = []): MSTeamsPollStore {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const polls = new Map<string, MSTeamsPoll>();
  for (const poll of initial) {
    polls.set(poll.id, { ...poll });
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const createPoll = async (poll: MSTeamsPoll) => {
    polls.set(poll.id, { ...poll });
  };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const getPoll = async (pollId: string) => polls.get(pollId) ?? null;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const recordVote = async (params: { pollId: string; voterId: string; selections: string[] }) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const poll = polls.get(params.pollId);
    if (!poll) {
      return null;
    }
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const normalized = normalizeMSTeamsPollSelections(poll, params.selections);
    poll.votes[params.voterId] = normalized;
    poll.updatedAt = new Date().toISOString();
    polls.set(poll.id, poll);
    return poll;
  };

  return { createPoll, getPoll, recordVote };
}
