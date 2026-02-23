/*
 * AUTO ANNOTATION
 * File: src/daemon/cmd-argv.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { parseCmdScriptCommandLine, quoteCmdScriptArg } from "./cmd-argv.js";

describe("cmd argv helpers", () => {
  it.each([
    "plain",
    "with space",
    "safe&whoami",
    "safe|whoami",
    "safe<in",
    "safe>out",
    "safe^caret",
    "%TEMP%",
    "!token!",
    'he said "hi"',
  ])("round-trips single arg: %p", (arg) => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const encoded = quoteCmdScriptArg(arg);
    expect(parseCmdScriptCommandLine(encoded)).toEqual([arg]);
  });

  it("round-trips mixed command lines", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const args = [
      "node",
      "gateway.js",
      "--display-name",
      "safe&whoami",
      "--percent",
      "%TEMP%",
      "--bang",
      "!token!",
      "--quoted",
      'he said "hi"',
    ];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const encoded = args.map(quoteCmdScriptArg).join(" ");
    expect(parseCmdScriptCommandLine(encoded)).toEqual(args);
  });

  it("rejects CR/LF in command arguments", () => {
    expect(() => quoteCmdScriptArg("bad\narg")).toThrow(/Command argument cannot contain CR or LF/);
    expect(() => quoteCmdScriptArg("bad\rarg")).toThrow(/Command argument cannot contain CR or LF/);
  });
});
