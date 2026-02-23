/*
 * AUTO ANNOTATION
 * File: src/web/reconnect.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import {
  computeBackoff,
  DEFAULT_HEARTBEAT_SECONDS,
  DEFAULT_RECONNECT_POLICY,
  resolveHeartbeatSeconds,
  resolveReconnectPolicy,
  sleepWithAbort,
} from "./reconnect.js";

describe("web reconnect helpers", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const cfg: OpenClawConfig = {};

  it("resolves sane reconnect defaults with clamps", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const policy = resolveReconnectPolicy(cfg, {
      initialMs: 100,
      maxMs: 5,
      factor: 20,
      jitter: 2,
      maxAttempts: -1,
    });

    expect(policy.initialMs).toBe(250); // clamped to minimum
    expect(policy.maxMs).toBeGreaterThanOrEqual(policy.initialMs);
    expect(policy.factor).toBeLessThanOrEqual(10);
    expect(policy.jitter).toBeLessThanOrEqual(1);
    expect(policy.maxAttempts).toBeGreaterThanOrEqual(0);
  });

  it("computes increasing backoff with jitter", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const policy = { ...DEFAULT_RECONNECT_POLICY, jitter: 0 };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const first = computeBackoff(policy, 1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const second = computeBackoff(policy, 2);
    expect(first).toBe(policy.initialMs);
    expect(second).toBeGreaterThan(first);
    expect(second).toBeLessThanOrEqual(policy.maxMs);
  });

  it("returns heartbeat default when unset", () => {
    expect(resolveHeartbeatSeconds(cfg)).toBe(DEFAULT_HEARTBEAT_SECONDS);
    expect(resolveHeartbeatSeconds(cfg, 5)).toBe(5);
  });

  it("sleepWithAbort rejects on abort", async () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const controller = new AbortController();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const promise = sleepWithAbort(50, controller.signal);
    controller.abort();
    await expect(promise).rejects.toThrow("aborted");
  });
});
