/*
 * AUTO ANNOTATION
 * File: src/cli/program/program-context.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Command } from "commander";
import { describe, expect, it } from "vitest";
import type { ProgramContext } from "./context.js";
import { getProgramContext, setProgramContext } from "./program-context.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function makeCtx(version: string): ProgramContext {
  return {
    programVersion: version,
    channelOptions: ["telegram"],
    messageChannelOptions: "telegram",
    agentChannelOptions: "last|telegram",
  };
}

describe("program context storage", () => {
  it("stores and retrieves context on a command instance", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const program = new Command();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctx = makeCtx("1.2.3");
    setProgramContext(program, ctx);
    expect(getProgramContext(program)).toBe(ctx);
  });

  it("returns undefined when no context was set", () => {
    expect(getProgramContext(new Command())).toBeUndefined();
  });

  it("does not leak context between command instances", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const programA = new Command();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const programB = new Command();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctxA = makeCtx("a");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ctxB = makeCtx("b");
    setProgramContext(programA, ctxA);
    setProgramContext(programB, ctxB);

    expect(getProgramContext(programA)).toBe(ctxA);
    expect(getProgramContext(programB)).toBe(ctxB);
  });
});
