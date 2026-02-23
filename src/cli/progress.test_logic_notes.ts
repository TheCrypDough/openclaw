/*
 * AUTO ANNOTATION
 * File: src/cli/progress.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { createCliProgress } from "./progress.js";

describe("cli progress", () => {
  it("logs progress when non-tty and fallback=log", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const writes: string[] = [];
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stream = {
      isTTY: false,
      write: vi.fn((chunk: string) => {
        writes.push(chunk);
      }),
    } as unknown as NodeJS.WriteStream;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const progress = createCliProgress({
      label: "Indexing memory...",
      total: 10,
      stream,
      fallback: "log",
    });
    progress.setPercent(50);
    progress.done();

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const output = writes.join("");
    expect(output).toContain("Indexing memory... 0%");
    expect(output).toContain("Indexing memory... 50%");
  });

  it("does not log without a tty when fallback is none", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const write = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stream = {
      isTTY: false,
      write,
    } as unknown as NodeJS.WriteStream;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const progress = createCliProgress({
      label: "Nope",
      total: 2,
      stream,
      fallback: "none",
    });
    progress.setPercent(50);
    progress.done();

    expect(write).not.toHaveBeenCalled();
  });
});
