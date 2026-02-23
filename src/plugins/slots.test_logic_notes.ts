/*
 * AUTO ANNOTATION
 * File: src/plugins/slots.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { applyExclusiveSlotSelection } from "./slots.js";

describe("applyExclusiveSlotSelection", () => {
  it("selects the slot and disables other entries for the same kind", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config: OpenClawConfig = {
      plugins: {
        slots: { memory: "memory-core" },
        entries: {
          "memory-core": { enabled: true },
          memory: { enabled: true },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = applyExclusiveSlotSelection({
      config,
      selectedId: "memory",
      selectedKind: "memory",
      registry: {
        plugins: [
          { id: "memory-core", kind: "memory" },
          { id: "memory", kind: "memory" },
        ],
      },
    });

    expect(result.changed).toBe(true);
    expect(result.config.plugins?.slots?.memory).toBe("memory");
    expect(result.config.plugins?.entries?.["memory-core"]?.enabled).toBe(false);
    expect(result.warnings).toContain(
      'Exclusive slot "memory" switched from "memory-core" to "memory".',
    );
    expect(result.warnings).toContain('Disabled other "memory" slot plugins: memory-core.');
  });

  it("does nothing when the slot already matches", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config: OpenClawConfig = {
      plugins: {
        slots: { memory: "memory" },
        entries: {
          memory: { enabled: true },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = applyExclusiveSlotSelection({
      config,
      selectedId: "memory",
      selectedKind: "memory",
      registry: { plugins: [{ id: "memory", kind: "memory" }] },
    });

    expect(result.changed).toBe(false);
    expect(result.warnings).toHaveLength(0);
    expect(result.config).toBe(config);
  });

  it("warns when the slot falls back to a default", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config: OpenClawConfig = {
      plugins: {
        entries: {
          memory: { enabled: true },
        },
      },
    };

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = applyExclusiveSlotSelection({
      config,
      selectedId: "memory",
      selectedKind: "memory",
      registry: { plugins: [{ id: "memory", kind: "memory" }] },
    });

    expect(result.changed).toBe(true);
    expect(result.warnings).toContain(
      'Exclusive slot "memory" switched from "memory-core" to "memory".',
    );
  });

  it("skips changes when no exclusive slot applies", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const config: OpenClawConfig = {};
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const result = applyExclusiveSlotSelection({
      config,
      selectedId: "custom",
    });

    expect(result.changed).toBe(false);
    expect(result.warnings).toHaveLength(0);
    expect(result.config).toBe(config);
  });
});
