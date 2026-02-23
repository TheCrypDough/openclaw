# AUTOPLACEHOLDER_ANNOTATION: src/config/config.msteams.test.ts
# Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
# Area: Core application source (gateway, CLI, providers, channels)
# System effect: When changed, core execution path for message, session, or provider behavior may change.
import { describe, expect, it } from "vitest";
import { validateConfigObject } from "./config.js";

describe("config msteams", () => {
  it("accepts replyStyle at global/team/channel levels", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: {
        msteams: {
          replyStyle: "top-level",
          teams: {
            team123: {
              replyStyle: "thread",
              channels: {
                chan456: { replyStyle: "top-level" },
              },
            },
          },
        },
      },
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.config.channels?.msteams?.replyStyle).toBe("top-level");
      expect(res.config.channels?.msteams?.teams?.team123?.replyStyle).toBe("thread");
      expect(res.config.channels?.msteams?.teams?.team123?.channels?.chan456?.replyStyle).toBe(
        "top-level",
      );
    }
  });

  it("rejects invalid replyStyle", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const res = validateConfigObject({
      channels: { msteams: { replyStyle: "nope" } },
    });
    expect(res.ok).toBe(false);
  });
});
