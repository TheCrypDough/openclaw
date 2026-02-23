/*
 * AUTO ANNOTATION
 * File: src/terminal/prompt-select-styled.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const { selectMock, stylePromptMessageMock, stylePromptHintMock } = vi.hoisted(() => ({
  selectMock: vi.fn(),
  stylePromptMessageMock: vi.fn((value: string) => `msg:${value}`),
  stylePromptHintMock: vi.fn((value: string) => `hint:${value}`),
}));

vi.mock("@clack/prompts", () => ({
  select: selectMock,
}));

vi.mock("./prompt-style.js", () => ({
  stylePromptMessage: stylePromptMessageMock,
  stylePromptHint: stylePromptHintMock,
}));

import { selectStyled } from "./prompt-select-styled.js";

describe("selectStyled", () => {
  beforeEach(() => {
    selectMock.mockReset();
    stylePromptMessageMock.mockClear();
    stylePromptHintMock.mockClear();
  });

  it("styles message and option hints before delegating to clack select", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const expected = Symbol("selected");
    selectMock.mockReturnValue(expected);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = selectStyled({
      message: "Pick channel",
      options: [
        { value: "stable", label: "Stable", hint: "Tagged releases" },
        { value: "dev", label: "Dev" },
      ],
    });

    expect(result).toBe(expected);
    expect(stylePromptMessageMock).toHaveBeenCalledWith("Pick channel");
    expect(stylePromptHintMock).toHaveBeenCalledWith("Tagged releases");
    expect(selectMock).toHaveBeenCalledWith({
      message: "msg:Pick channel",
      options: [
        { value: "stable", label: "Stable", hint: "hint:Tagged releases" },
        { value: "dev", label: "Dev" },
      ],
    });
  });
});
