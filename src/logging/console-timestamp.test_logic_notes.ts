/*
 * AUTO ANNOTATION
 * File: src/logging/console-timestamp.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { formatConsoleTimestamp } from "./console.js";

describe("formatConsoleTimestamp", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function pad2(n: number) {
    return String(n).padStart(2, "0");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function pad3(n: number) {
    return String(n).padStart(3, "0");
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  function formatExpectedLocalIsoWithOffset(now: Date) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const year = now.getFullYear();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const month = pad2(now.getMonth() + 1);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const day = pad2(now.getDate());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const h = pad2(now.getHours());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const m = pad2(now.getMinutes());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const s = pad2(now.getSeconds());
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const ms = pad3(now.getMilliseconds());
    const tzOffset = now.getTimezoneOffset();
    const tzSign = tzOffset <= 0 ? "+" : "-";
    const tzHours = pad2(Math.floor(Math.abs(tzOffset) / 60));
    const tzMinutes = pad2(Math.abs(tzOffset) % 60);
    return `${year}-${month}-${day}T${h}:${m}:${s}.${ms}${tzSign}${tzHours}:${tzMinutes}`;
  }

  it("pretty style returns local HH:MM:SS", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-17T18:01:02.345Z"));

    const result = formatConsoleTimestamp("pretty");
    const now = new Date();
    expect(result).toBe(
      `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`,
    );
  });

  it("compact style returns local ISO-like timestamp with timezone offset", () => {
    const result = formatConsoleTimestamp("compact");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/);

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-17T18:01:02.345Z"));
    const now = new Date();
    expect(formatConsoleTimestamp("compact")).toBe(formatExpectedLocalIsoWithOffset(now));
  });

  it("json style returns local ISO-like timestamp with timezone offset", () => {
    const result = formatConsoleTimestamp("json");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/);

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-17T18:01:02.345Z"));
    const now = new Date();
    expect(formatConsoleTimestamp("json")).toBe(formatExpectedLocalIsoWithOffset(now));
  });

  it("timestamp contains the correct local date components", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-17T18:01:02.345Z"));

    const before = new Date();
    const result = formatConsoleTimestamp("compact");
    const after = new Date();
    // The date portion should match the local date
    const datePart = result.slice(0, 10);
    const beforeDate = `${before.getFullYear()}-${String(before.getMonth() + 1).padStart(2, "0")}-${String(before.getDate()).padStart(2, "0")}`;
    const afterDate = `${after.getFullYear()}-${String(after.getMonth() + 1).padStart(2, "0")}-${String(after.getDate()).padStart(2, "0")}`;
    // Allow for date boundary crossing during test
    expect([beforeDate, afterDate]).toContain(datePart);
  });
});
