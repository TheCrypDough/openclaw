/*
 * AUTO ANNOTATION
 * File: src/gateway/server/presence-events.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { broadcastPresenceSnapshot } from "./presence-events.js";

describe("broadcastPresenceSnapshot", () => {
  it("increments version and broadcasts presence with state versions", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const broadcast = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const incrementPresenceVersion = vi.fn(() => 7);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const getHealthVersion = vi.fn(() => 11);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const presenceVersion = broadcastPresenceSnapshot({
      broadcast,
      incrementPresenceVersion,
      getHealthVersion,
    });

    expect(presenceVersion).toBe(7);
    expect(incrementPresenceVersion).toHaveBeenCalledTimes(1);
    expect(getHealthVersion).toHaveBeenCalledTimes(1);
    expect(broadcast).toHaveBeenCalledTimes(1);

    const [event, payload, opts] = broadcast.mock.calls[0] as [
      string,
      unknown,
      { dropIfSlow?: boolean; stateVersion?: { presence?: number; health?: number } } | undefined,
    ];

    expect(event).toBe("presence");
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("expected object payload");
    }
    expect(Array.isArray((payload as { presence?: unknown }).presence)).toBe(true);
    expect(opts?.dropIfSlow).toBe(true);
    expect(opts?.stateVersion).toEqual({ presence: 7, health: 11 });
  });
});
