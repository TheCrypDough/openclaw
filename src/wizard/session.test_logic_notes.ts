/*
 * AUTO ANNOTATION
 * File: src/wizard/session.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, test } from "vitest";
import { WizardSession } from "./session.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function noteRunner() {
  return new WizardSession(async (prompter) => {
    await prompter.note("Welcome");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const name = await prompter.text({ message: "Name" });
    await prompter.note(`Hello ${name}`);
  });
}

describe("WizardSession", () => {
  test("steps progress in order", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const session = noteRunner();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const first = await session.next();
    expect(first.done).toBe(false);
    expect(first.step?.type).toBe("note");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const secondPeek = await session.next();
    expect(secondPeek.step?.id).toBe(first.step?.id);

    if (!first.step) {
      throw new Error("expected first step");
    }
    await session.answer(first.step.id, null);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const second = await session.next();
    expect(second.done).toBe(false);
    expect(second.step?.type).toBe("text");

    if (!second.step) {
      throw new Error("expected second step");
    }
    await session.answer(second.step.id, "Peter");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const third = await session.next();
    expect(third.step?.type).toBe("note");

    if (!third.step) {
      throw new Error("expected third step");
    }
    await session.answer(third.step.id, null);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const done = await session.next();
    expect(done.done).toBe(true);
    expect(done.status).toBe("done");
  });

  test("invalid answers throw", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const session = noteRunner();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const first = await session.next();
    await expect(session.answer("bad-id", null)).rejects.toThrow(/wizard: no pending step/i);
    if (!first.step) {
      throw new Error("expected first step");
    }
    await session.answer(first.step.id, null);
  });

  test("cancel marks session and unblocks", async () => {
    const session = new WizardSession(async (prompter) => {
      await prompter.text({ message: "Name" });
    });

    const step = await session.next();
    expect(step.step?.type).toBe("text");

    session.cancel();

    const done = await session.next();
    expect(done.done).toBe(true);
    expect(done.status).toBe("cancelled");
  });
});
