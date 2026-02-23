# AUTOPLACEHOLDER_ANNOTATION: src/config/config.discord-presence.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { describe, expect, it } from "vitest";
import { validateConfigObject } from "./config.js";

describe("config discord presence", () => {
  it("accepts status-only presence", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        discord: {
          status: "idle",
        },
      },
    });

    expect(res.ok).toBe(true);
  });

  it("accepts custom activity when type is omitted", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        discord: {
          activity: "Focus time",
        },
      },
    });

    expect(res.ok).toBe(true);
  });

  it("accepts custom activity type", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        discord: {
          activity: "Chilling",
          activityType: 4,
        },
      },
    });

    expect(res.ok).toBe(true);
  });

  it("rejects streaming activity without url", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        discord: {
          activity: "Live",
          activityType: 1,
        },
      },
    });

    expect(res.ok).toBe(false);
  });

  it("rejects activityUrl without streaming type", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        discord: {
          activity: "Live",
          activityUrl: "https://twitch.tv/openclaw",
        },
      },
    });

    expect(res.ok).toBe(false);
  });
});
