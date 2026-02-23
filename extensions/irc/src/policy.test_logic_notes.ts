/*
 * AUTO ANNOTATION
 * File: extensions/irc/src/policy.test.ts
 * Purpose: Extension package component that adds a channel/tool integration or adapter.
 * Module area: Pluggable channel and service extensions
 * System effect: Alters gateway ecosystem integration points and feature surface exposed through plugin loading.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { resolveChannelGroupPolicy } from "../../../src/config/group-policy.js";
import {
  resolveIrcGroupAccessGate,
  resolveIrcGroupMatch,
  resolveIrcGroupSenderAllowed,
  resolveIrcMentionGate,
  resolveIrcRequireMention,
} from "./policy.js";

describe("irc policy", () => {
  it("matches direct and wildcard group entries", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const direct = resolveIrcGroupMatch({
      groups: {
        "#ops": { requireMention: false },
      },
      target: "#ops",
    });
    expect(direct.allowed).toBe(true);
    expect(resolveIrcRequireMention({ groupConfig: direct.groupConfig })).toBe(false);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const wildcard = resolveIrcGroupMatch({
      groups: {
        "*": { requireMention: true },
      },
      target: "#random",
    });
    expect(wildcard.allowed).toBe(true);
    expect(resolveIrcRequireMention({ wildcardConfig: wildcard.wildcardConfig })).toBe(true);
  });

  it("enforces allowlist by default in groups", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const message = {
      messageId: "m1",
      target: "#ops",
      senderNick: "alice",
      senderUser: "ident",
      senderHost: "example.org",
      text: "hi",
      timestamp: Date.now(),
      isGroup: true,
    };

    expect(
      resolveIrcGroupSenderAllowed({
        groupPolicy: "allowlist",
        message,
        outerAllowFrom: [],
        innerAllowFrom: [],
      }),
    ).toBe(false);

    expect(
      resolveIrcGroupSenderAllowed({
        groupPolicy: "allowlist",
        message,
        outerAllowFrom: ["alice"],
        innerAllowFrom: [],
      }),
    ).toBe(true);
  });

  it('allows unconfigured channels when groupPolicy is "open"', () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const groupMatch = resolveIrcGroupMatch({
      groups: undefined,
      target: "#random",
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const gate = resolveIrcGroupAccessGate({
      groupPolicy: "open",
      groupMatch,
    });
    expect(gate.allowed).toBe(true);
    expect(gate.reason).toBe("open");
  });

  it("honors explicit group disable even in open mode", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const groupMatch = resolveIrcGroupMatch({
      groups: {
        "#ops": { enabled: false },
      },
      target: "#ops",
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const gate = resolveIrcGroupAccessGate({
      groupPolicy: "open",
      groupMatch,
    });
    expect(gate.allowed).toBe(false);
    expect(gate.reason).toBe("disabled");
  });

  it("allows authorized control commands without mention", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const gate = resolveIrcMentionGate({
      isGroup: true,
      requireMention: true,
      wasMentioned: false,
      hasControlCommand: true,
      allowTextCommands: true,
      commandAuthorized: true,
    });
    expect(gate.shouldSkip).toBe(false);
  });

  it("keeps case-insensitive group matching aligned with shared channel policy resolution", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const groups = {
      "#Ops": { requireMention: false },
      "#Hidden": { enabled: false },
      "*": { requireMention: true },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const inboundDirect = resolveIrcGroupMatch({ groups, target: "#ops" });
    const sharedDirect = resolveChannelGroupPolicy({
      cfg: { channels: { irc: { groups } } },
      channel: "irc",
      groupId: "#ops",
      groupIdCaseInsensitive: true,
    });
    expect(sharedDirect.allowed).toBe(inboundDirect.allowed);
    expect(sharedDirect.groupConfig?.requireMention).toBe(
      inboundDirect.groupConfig?.requireMention,
    );

    const inboundDisabled = resolveIrcGroupMatch({ groups, target: "#hidden" });
    const sharedDisabled = resolveChannelGroupPolicy({
      cfg: { channels: { irc: { groups } } },
      channel: "irc",
      groupId: "#hidden",
      groupIdCaseInsensitive: true,
    });
    expect(sharedDisabled.allowed).toBe(inboundDisabled.allowed);
    expect(inboundDisabled.groupConfig?.enabled).toBe(false);
  });
});
