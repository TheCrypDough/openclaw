/*
 * AUTO ANNOTATION
 * File: src/auto-reply/reply/commands-setunset.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { parseStandardSetUnsetSlashCommand } from "./commands-setunset-standard.js";
import {
  parseSetUnsetCommand,
  parseSetUnsetCommandAction,
  parseSlashCommandWithSetUnset,
} from "./commands-setunset.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type ParsedSetUnsetAction =
  | { action: "set"; path: string; value: unknown }
  | { action: "unset"; path: string }
  | { action: "error"; message: string };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createActionMappers() {
  return {
    onSet: (path: string, value: unknown): ParsedSetUnsetAction => ({ action: "set", path, value }),
    onUnset: (path: string): ParsedSetUnsetAction => ({ action: "unset", path }),
    onError: (message: string): ParsedSetUnsetAction => ({ action: "error", message }),
  };
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function createSlashParams(params: {
  raw: string;
  onKnownAction?: (action: string) => ParsedSetUnsetAction | undefined;
}) {
  return {
    raw: params.raw,
    slash: "/config",
    invalidMessage: "Invalid /config syntax.",
    usageMessage: "Usage: /config show|set|unset",
    onKnownAction: params.onKnownAction ?? (() => undefined),
    ...createActionMappers(),
  };
}

describe("parseSetUnsetCommand", () => {
  it("parses unset values", () => {
    expect(
      parseSetUnsetCommand({
        slash: "/config",
        action: "unset",
        args: "foo.bar",
      }),
    ).toEqual({ kind: "unset", path: "foo.bar" });
  });

  it("parses set values", () => {
    expect(
      parseSetUnsetCommand({
        slash: "/config",
        action: "set",
        args: 'foo.bar={"x":1}',
      }),
    ).toEqual({ kind: "set", path: "foo.bar", value: { x: 1 } });
  });
});

describe("parseSetUnsetCommandAction", () => {
  it("returns null for non set/unset actions", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mappers = createActionMappers();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = parseSetUnsetCommandAction<ParsedSetUnsetAction>({
      slash: "/config",
      action: "show",
      args: "",
      ...mappers,
    });
    expect(result).toBeNull();
  });

  it("maps parse errors through onError", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const mappers = createActionMappers();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = parseSetUnsetCommandAction<ParsedSetUnsetAction>({
      slash: "/config",
      action: "set",
      args: "",
      ...mappers,
    });
    expect(result).toEqual({ action: "error", message: "Usage: /config set path=value" });
  });
});

describe("parseSlashCommandWithSetUnset", () => {
  it("returns null when the input does not match the slash command", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = parseSlashCommandWithSetUnset<ParsedSetUnsetAction>(
      createSlashParams({ raw: "/debug show" }),
    );
    expect(result).toBeNull();
  });

  it("prefers set/unset mapping and falls back to known actions", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const setResult = parseSlashCommandWithSetUnset<ParsedSetUnsetAction>(
      createSlashParams({
        raw: '/config set a.b={"ok":true}',
      }),
    );
    expect(setResult).toEqual({ action: "set", path: "a.b", value: { ok: true } });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const showResult = parseSlashCommandWithSetUnset<ParsedSetUnsetAction>(
      createSlashParams({
        raw: "/config show",
        onKnownAction: (action) =>
          action === "show" ? { action: "unset", path: "dummy" } : undefined,
      }),
    );
    expect(showResult).toEqual({ action: "unset", path: "dummy" });
  });

  it("returns onError for unknown actions", () => {
    const unknownAction = parseSlashCommandWithSetUnset<ParsedSetUnsetAction>(
      createSlashParams({
        raw: "/config whoami",
      }),
    );
    expect(unknownAction).toEqual({ action: "error", message: "Usage: /config show|set|unset" });
  });
});

describe("parseStandardSetUnsetSlashCommand", () => {
  it("uses default set/unset/error mappings", () => {
    const result = parseStandardSetUnsetSlashCommand<ParsedSetUnsetAction>({
      raw: '/config set a.b={"ok":true}',
      slash: "/config",
      invalidMessage: "Invalid /config syntax.",
      usageMessage: "Usage: /config show|set|unset",
      onKnownAction: () => undefined,
    });
    expect(result).toEqual({ action: "set", path: "a.b", value: { ok: true } });
  });

  it("supports caller-provided mappings", () => {
    const result = parseStandardSetUnsetSlashCommand<ParsedSetUnsetAction>({
      raw: "/config unset a.b",
      slash: "/config",
      invalidMessage: "Invalid /config syntax.",
      usageMessage: "Usage: /config show|set|unset",
      onKnownAction: () => undefined,
      onUnset: (path) => ({ action: "unset", path: `wrapped:${path}` }),
    });
    expect(result).toEqual({ action: "unset", path: "wrapped:a.b" });
  });
});
