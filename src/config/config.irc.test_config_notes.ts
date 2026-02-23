# AUTOPLACEHOLDER_ANNOTATION: src/config/config.irc.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { describe, expect, it } from "vitest";
import { validateConfigObject } from "./config.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function expectValidConfig(result: ReturnType<typeof validateConfigObject>) {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error("expected config to be valid");
  }
  return result.config;
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function expectInvalidConfig(result: ReturnType<typeof validateConfigObject>) {
  expect(result.ok).toBe(false);
  if (result.ok) {
    throw new Error("expected config to be invalid");
  }
  return result.issues;
}

describe("config irc", () => {
  it("accepts basic irc config", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        irc: {
          host: "irc.libera.chat",
          nick: "openclaw-bot",
          channels: ["#openclaw"],
        },
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = expectValidConfig(res);
    expect(config.channels?.irc?.host).toBe("irc.libera.chat");
    expect(config.channels?.irc?.nick).toBe("openclaw-bot");
  });

  it('rejects irc.dmPolicy="open" without allowFrom "*"', () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        irc: {
          dmPolicy: "open",
          allowFrom: ["alice"],
        },
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const issues = expectInvalidConfig(res);
    expect(issues[0]?.path).toBe("channels.irc.allowFrom");
  });

  it('accepts irc.dmPolicy="open" with allowFrom "*"', () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        irc: {
          dmPolicy: "open",
          allowFrom: ["*"],
        },
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = expectValidConfig(res);
    expect(config.channels?.irc?.dmPolicy).toBe("open");
  });

  it("accepts mixed allowFrom value types for IRC", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        irc: {
          allowFrom: [12345, "alice"],
          groupAllowFrom: [67890, "alice!ident@example.org"],
          groups: {
            "#ops": {
              allowFrom: [42, "alice"],
            },
          },
        },
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config = expectValidConfig(res);
    expect(config.channels?.irc?.allowFrom).toEqual([12345, "alice"]);
    expect(config.channels?.irc?.groupAllowFrom).toEqual([67890, "alice!ident@example.org"]);
    expect(config.channels?.irc?.groups?.["#ops"]?.allowFrom).toEqual([42, "alice"]);
  });

  it("rejects nickserv register without registerEmail", () => {
    const res = validateConfigObject({
      channels: {
        irc: {
          nickserv: {
            register: true,
            password: "secret",
          },
        },
      },
    });

    const issues = expectInvalidConfig(res);
    expect(issues[0]?.path).toBe("channels.irc.nickserv.registerEmail");
  });

  it("accepts nickserv register with password and registerEmail", () => {
    const res = validateConfigObject({
      channels: {
        irc: {
          nickserv: {
            register: true,
            password: "secret",
            registerEmail: "bot@example.com",
          },
        },
      },
    });

    const config = expectValidConfig(res);
    expect(config.channels?.irc?.nickserv?.register).toBe(true);
  });

  it("accepts nickserv register with registerEmail only (password may come from env)", () => {
    const res = validateConfigObject({
      channels: {
        irc: {
          nickserv: {
            register: true,
            registerEmail: "bot@example.com",
          },
        },
      },
    });

    expectValidConfig(res);
  });
});
