/*
 * AUTO ANNOTATION
 * File: src/tui/tui-local-shell.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { createLocalShellRunner } from "./tui-local-shell.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const createSelector = () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const selector = {
    onSelect: undefined as ((item: { value: string; label: string }) => void) | undefined,
    onCancel: undefined as (() => void) | undefined,
    render: () => ["selector"],
    invalidate: () => {},
  };
  return selector;
};

describe("createLocalShellRunner", () => {
  it("logs denial on subsequent ! attempts without re-prompting", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const messages: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const chatLog = {
      addSystem: (line: string) => {
        messages.push(line);
      },
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const tui = { requestRender: vi.fn() };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const openOverlay = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const closeOverlay = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let lastSelector: ReturnType<typeof createSelector> | null = null;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const createSelectorSpy = vi.fn(() => {
      lastSelector = createSelector();
      return lastSelector;
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const spawnCommand = vi.fn();

    const { runLocalShellLine } = createLocalShellRunner({
      chatLog,
      tui,
      openOverlay,
      closeOverlay,
      createSelector: createSelectorSpy,
      spawnCommand,
    });

    const firstRun = runLocalShellLine("!ls");
    expect(openOverlay).toHaveBeenCalledTimes(1);
    const selector = lastSelector as ReturnType<typeof createSelector> | null;
    selector?.onSelect?.({ value: "no", label: "No" });
    await firstRun;

    await runLocalShellLine("!pwd");

    expect(messages).toContain("local shell: not enabled");
    expect(messages).toContain("local shell: not enabled for this session");
    expect(createSelectorSpy).toHaveBeenCalledTimes(1);
    expect(spawnCommand).not.toHaveBeenCalled();
  });
});
