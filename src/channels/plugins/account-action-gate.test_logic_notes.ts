/*
 * AUTO ANNOTATION
 * File: src/channels/plugins/account-action-gate.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { createAccountActionGate } from "./account-action-gate.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
type TestActions = {
  send?: boolean;
  reactions?: boolean;
};

describe("createAccountActionGate", () => {
  it("prefers account action values over base values", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const gate = createAccountActionGate<TestActions>({
      baseActions: { send: false, reactions: true },
      accountActions: { send: true },
    });
    expect(gate("send")).toBe(true);
  });

  it("falls back to base actions when account actions are unset", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const gate = createAccountActionGate<TestActions>({
      baseActions: { reactions: false },
      accountActions: {},
    });
    expect(gate("reactions")).toBe(false);
  });

  it("uses default value when neither account nor base defines the key", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const gate = createAccountActionGate<TestActions>({
      baseActions: {},
      accountActions: {},
    });
    expect(gate("send", false)).toBe(false);
    expect(gate("send")).toBe(true);
  });
});
