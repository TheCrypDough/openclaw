/*
 * AUTO ANNOTATION
 * File: src/logging/parse-log-line.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import { parseLogLine } from "./parse-log-line.js";

describe("parseLogLine", () => {
  it("parses structured JSON log lines", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const line = JSON.stringify({
      time: "2026-01-09T01:38:41.523Z",
      0: '{"subsystem":"gateway/channels/whatsapp"}',
      1: "connected",
      _meta: {
        name: '{"subsystem":"gateway/channels/whatsapp"}',
        logLevelName: "INFO",
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = parseLogLine(line);

    expect(parsed).not.toBeNull();
    expect(parsed?.time).toBe("2026-01-09T01:38:41.523Z");
    expect(parsed?.level).toBe("info");
    expect(parsed?.subsystem).toBe("gateway/channels/whatsapp");
    expect(parsed?.message).toBe('{"subsystem":"gateway/channels/whatsapp"} connected');
    expect(parsed?.raw).toBe(line);
  });

  it("falls back to meta timestamp when top-level time is missing", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const line = JSON.stringify({
      0: "hello",
      _meta: {
        name: '{"subsystem":"gateway"}',
        logLevelName: "WARN",
        date: "2026-01-09T02:10:00.000Z",
      },
    });

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const parsed = parseLogLine(line);

    expect(parsed?.time).toBe("2026-01-09T02:10:00.000Z");
    expect(parsed?.level).toBe("warn");
  });

  it("returns null for invalid JSON", () => {
    expect(parseLogLine("not-json")).toBeNull();
  });
});
