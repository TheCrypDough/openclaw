/*
 * AUTO ANNOTATION
 * File: src/cli/program/register.message.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { Command } from "commander";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProgramContext } from "./context.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const createMessageCliHelpersMock = vi.fn(() => ({ helper: true }));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const registerMessageSendCommandMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const registerMessageBroadcastCommandMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const registerMessagePollCommandMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const registerMessageReactionsCommandsMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const registerMessageReadEditDeleteCommandsMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const registerMessagePinCommandsMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const registerMessagePermissionsCommandMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const registerMessageSearchCommandMock = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const registerMessageThreadCommandsMock = vi.fn();
const registerMessageEmojiCommandsMock = vi.fn();
const registerMessageStickerCommandsMock = vi.fn();
const registerMessageDiscordAdminCommandsMock = vi.fn();

vi.mock("./message/helpers.js", () => ({
  createMessageCliHelpers: createMessageCliHelpersMock,
}));

vi.mock("./message/register.send.js", () => ({
  registerMessageSendCommand: registerMessageSendCommandMock,
}));

vi.mock("./message/register.broadcast.js", () => ({
  registerMessageBroadcastCommand: registerMessageBroadcastCommandMock,
}));

vi.mock("./message/register.poll.js", () => ({
  registerMessagePollCommand: registerMessagePollCommandMock,
}));

vi.mock("./message/register.reactions.js", () => ({
  registerMessageReactionsCommands: registerMessageReactionsCommandsMock,
}));

vi.mock("./message/register.read-edit-delete.js", () => ({
  registerMessageReadEditDeleteCommands: registerMessageReadEditDeleteCommandsMock,
}));

vi.mock("./message/register.pins.js", () => ({
  registerMessagePinCommands: registerMessagePinCommandsMock,
}));

vi.mock("./message/register.permissions-search.js", () => ({
  registerMessagePermissionsCommand: registerMessagePermissionsCommandMock,
  registerMessageSearchCommand: registerMessageSearchCommandMock,
}));

vi.mock("./message/register.thread.js", () => ({
  registerMessageThreadCommands: registerMessageThreadCommandsMock,
}));

vi.mock("./message/register.emoji-sticker.js", () => ({
  registerMessageEmojiCommands: registerMessageEmojiCommandsMock,
  registerMessageStickerCommands: registerMessageStickerCommandsMock,
}));

vi.mock("./message/register.discord-admin.js", () => ({
  registerMessageDiscordAdminCommands: registerMessageDiscordAdminCommandsMock,
}));

let registerMessageCommands: typeof import("./register.message.js").registerMessageCommands;

beforeAll(async () => {
  ({ registerMessageCommands } = await import("./register.message.js"));
});

describe("registerMessageCommands", () => {
  const ctx: ProgramContext = {
    programVersion: "9.9.9-test",
    channelOptions: ["telegram", "discord"],
    messageChannelOptions: "telegram|discord",
    agentChannelOptions: "last|telegram|discord",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    createMessageCliHelpersMock.mockReturnValue({ helper: true });
  });

  it("registers message command and wires all message sub-registrars with shared helpers", () => {
    const program = new Command();
    registerMessageCommands(program, ctx);

    const message = program.commands.find((command) => command.name() === "message");
    expect(message).toBeDefined();
    expect(createMessageCliHelpersMock).toHaveBeenCalledWith(message, "telegram|discord");

    const expectedRegistrars = [
      registerMessageSendCommandMock,
      registerMessageBroadcastCommandMock,
      registerMessagePollCommandMock,
      registerMessageReactionsCommandsMock,
      registerMessageReadEditDeleteCommandsMock,
      registerMessagePinCommandsMock,
      registerMessagePermissionsCommandMock,
      registerMessageSearchCommandMock,
      registerMessageThreadCommandsMock,
      registerMessageEmojiCommandsMock,
      registerMessageStickerCommandsMock,
      registerMessageDiscordAdminCommandsMock,
    ];
    for (const registrar of expectedRegistrars) {
      expect(registrar).toHaveBeenCalledWith(message, { helper: true });
    }
  });

  it("shows command help when root message command is invoked", async () => {
    const program = new Command().exitOverride();
    registerMessageCommands(program, ctx);
    const message = program.commands.find((command) => command.name() === "message");
    expect(message).toBeDefined();
    const helpSpy = vi.spyOn(message as Command, "help").mockImplementation(() => {
      throw new Error("help-called");
    });

    await expect(program.parseAsync(["message"], { from: "user" })).rejects.toThrow("help-called");
    expect(helpSpy).toHaveBeenCalledWith({ error: true });
  });
});
