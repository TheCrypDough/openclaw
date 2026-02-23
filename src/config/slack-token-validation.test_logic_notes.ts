/*
 * AUTO ANNOTATION
 * File: src/config/slack-token-validation.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { validateConfigObject } from "./config.js";

describe("Slack token config fields", () => {
  it("accepts user token config fields", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        slack: {
          botToken: "xoxb-any",
          appToken: "xapp-any",
          userToken: "xoxp-any",
          userTokenReadOnly: false,
        },
      },
    });
    expect(res.ok).toBe(true);
  });

  it("accepts account-level user token config", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        slack: {
          accounts: {
            work: {
              botToken: "xoxb-any",
              appToken: "xapp-any",
              userToken: "xoxp-any",
              userTokenReadOnly: true,
            },
          },
        },
      },
    });
    expect(res.ok).toBe(true);
  });

  it("rejects invalid userTokenReadOnly types", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        slack: {
          botToken: "xoxb-any",
          appToken: "xapp-any",
          userToken: "xoxp-any",
          // oxlint-disable-next-line typescript/no-explicit-any
          userTokenReadOnly: "no" as any,
        },
      },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues.some((iss) => iss.path.includes("userTokenReadOnly"))).toBe(true);
    }
  });

  it("rejects invalid userToken types", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        slack: {
          botToken: "xoxb-any",
          appToken: "xapp-any",
          // oxlint-disable-next-line typescript/no-explicit-any
          userToken: 123 as any,
        },
      },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues.some((iss) => iss.path.includes("userToken"))).toBe(true);
    }
  });
});
