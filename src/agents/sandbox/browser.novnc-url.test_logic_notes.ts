/*
 * AUTO ANNOTATION
 * File: src/agents/sandbox/browser.novnc-url.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import {
  buildNoVncDirectUrl,
  buildNoVncObserverTokenUrl,
  consumeNoVncObserverToken,
  issueNoVncObserverToken,
  resetNoVncObserverTokensForTests,
} from "./novnc-auth.js";

describe("noVNC auth helpers", () => {
  it("builds the default observer URL without password", () => {
    expect(buildNoVncDirectUrl(45678)).toBe(
      "http://127.0.0.1:45678/vnc.html?autoconnect=1&resize=remote",
    );
  });

  it("adds an encoded password query parameter when provided", () => {
    expect(buildNoVncDirectUrl(45678, "a+b c&d")).toBe(
      "http://127.0.0.1:45678/vnc.html?autoconnect=1&resize=remote&password=a%2Bb+c%26d",
    );
  });

  it("issues one-time short-lived observer tokens", () => {
    resetNoVncObserverTokensForTests();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const token = issueNoVncObserverToken({
      url: "http://127.0.0.1:50123/vnc.html?autoconnect=1&resize=remote&password=abcd1234",
      nowMs: 1000,
      ttlMs: 100,
    });
    expect(buildNoVncObserverTokenUrl("http://127.0.0.1:19999", token)).toBe(
      `http://127.0.0.1:19999/sandbox/novnc?token=${token}`,
    );
    expect(consumeNoVncObserverToken(token, 1050)).toContain("/vnc.html?");
    expect(consumeNoVncObserverToken(token, 1050)).toBeNull();
  });

  it("expires observer tokens", () => {
    resetNoVncObserverTokensForTests();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const token = issueNoVncObserverToken({
      url: "http://127.0.0.1:50123/vnc.html?autoconnect=1&resize=remote&password=abcd1234",
      nowMs: 1000,
      ttlMs: 100,
    });
    expect(consumeNoVncObserverToken(token, 1200)).toBeNull();
  });
});
