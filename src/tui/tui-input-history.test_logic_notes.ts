/*
 * AUTO ANNOTATION
 * File: src/tui/tui-input-history.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { createEditorSubmitHandler } from "./tui.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createSubmitHarness() {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const editor = {
    setText: vi.fn(),
    addToHistory: vi.fn(),
  };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const handleCommand = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const sendMessage = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const handleBangLine = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const handler = createEditorSubmitHandler({
    editor,
    handleCommand,
    sendMessage,
    handleBangLine,
  });
  return { editor, handleCommand, sendMessage, handleBangLine, handler };
}

describe("createEditorSubmitHandler", () => {
  it("adds submitted messages to editor history", () => {
    const { editor, handler } = createSubmitHarness();

    handler("hello world");

    expect(editor.setText).toHaveBeenCalledWith("");
    expect(editor.addToHistory).toHaveBeenCalledWith("hello world");
  });

  it("trims input before adding to history", () => {
    const { editor, handler } = createSubmitHarness();

    handler("   hi   ");

    expect(editor.addToHistory).toHaveBeenCalledWith("hi");
  });

  it.each(["", "   "])("does not add blank submissions to history", (text) => {
    const { editor, handler } = createSubmitHarness();

    handler(text);

    expect(editor.addToHistory).not.toHaveBeenCalled();
  });

  it("routes slash commands to handleCommand", () => {
    const { editor, handleCommand, sendMessage, handler } = createSubmitHarness();

    handler("/models");

    expect(editor.addToHistory).toHaveBeenCalledWith("/models");
    expect(handleCommand).toHaveBeenCalledWith("/models");
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("routes normal messages to sendMessage", () => {
    const { editor, handleCommand, sendMessage, handler } = createSubmitHarness();

    handler("hello");

    expect(editor.addToHistory).toHaveBeenCalledWith("hello");
    expect(sendMessage).toHaveBeenCalledWith("hello");
    expect(handleCommand).not.toHaveBeenCalled();
  });

  it("routes bang-prefixed lines to handleBangLine", () => {
    const { handleBangLine, handler } = createSubmitHarness();

    handler("!ls");

    expect(handleBangLine).toHaveBeenCalledWith("!ls");
  });
});
