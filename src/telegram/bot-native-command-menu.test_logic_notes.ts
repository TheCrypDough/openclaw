/*
 * AUTO ANNOTATION
 * File: src/telegram/bot-native-command-menu.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import {
  buildCappedTelegramMenuCommands,
  buildPluginTelegramMenuCommands,
  syncTelegramMenuCommands,
} from "./bot-native-command-menu.js";

describe("bot-native-command-menu", () => {
  it("caps menu entries to Telegram limit", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const allCommands = Array.from({ length: 105 }, (_, i) => ({
      command: `cmd_${i}`,
      description: `Command ${i}`,
    }));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = buildCappedTelegramMenuCommands({ allCommands });

    expect(result.commandsToRegister).toHaveLength(100);
    expect(result.totalCommands).toBe(105);
    expect(result.maxCommands).toBe(100);
    expect(result.overflowCount).toBe(5);
    expect(result.commandsToRegister[0]).toEqual({ command: "cmd_0", description: "Command 0" });
    expect(result.commandsToRegister[99]).toEqual({
      command: "cmd_99",
      description: "Command 99",
    });
  });

  it("validates plugin command specs and reports conflicts", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const existingCommands = new Set(["native"]);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = buildPluginTelegramMenuCommands({
      specs: [
        { name: "valid", description: "  Works  " },
        { name: "bad-name!", description: "Bad" },
        { name: "native", description: "Conflicts with native" },
        { name: "valid", description: "Duplicate plugin name" },
        { name: "empty", description: "   " },
      ],
      existingCommands,
    });

    expect(result.commands).toEqual([{ command: "valid", description: "Works" }]);
    expect(result.issues).toContain(
      'Plugin command "/bad-name!" is invalid for Telegram (use a-z, 0-9, underscore; max 32 chars).',
    );
    expect(result.issues).toContain(
      'Plugin command "/native" conflicts with an existing Telegram command.',
    );
    expect(result.issues).toContain('Plugin command "/valid" is duplicated.');
    expect(result.issues).toContain('Plugin command "/empty" is missing a description.');
  });

  it("normalizes hyphenated plugin command names", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = buildPluginTelegramMenuCommands({
      specs: [{ name: "agent-run", description: "Run agent" }],
      existingCommands: new Set<string>(),
    });

    expect(result.commands).toEqual([{ command: "agent_run", description: "Run agent" }]);
    expect(result.issues).toEqual([]);
  });

  it("deletes stale commands before setting new menu", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const callOrder: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const deleteMyCommands = vi.fn(async () => {
      callOrder.push("delete");
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const setMyCommands = vi.fn(async () => {
      callOrder.push("set");
    });

    syncTelegramMenuCommands({
      bot: {
        api: {
          deleteMyCommands,
          setMyCommands,
        },
      } as unknown as Parameters<typeof syncTelegramMenuCommands>[0]["bot"],
      runtime: {} as Parameters<typeof syncTelegramMenuCommands>[0]["runtime"],
      commandsToRegister: [{ command: "cmd", description: "Command" }],
    });

    await vi.waitFor(() => {
      expect(setMyCommands).toHaveBeenCalled();
    });

    expect(callOrder).toEqual(["delete", "set"]);
  });
});
