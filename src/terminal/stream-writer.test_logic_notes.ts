/*
 * AUTO ANNOTATION
 * File: src/terminal/stream-writer.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { createSafeStreamWriter } from "./stream-writer.js";

describe("createSafeStreamWriter", () => {
  it("signals broken pipes and closes the writer", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onBrokenPipe = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const writer = createSafeStreamWriter({ onBrokenPipe });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stream = {
      write: vi.fn(() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const err = new Error("EPIPE") as NodeJS.ErrnoException;
        err.code = "EPIPE";
        throw err;
      }),
    } as unknown as NodeJS.WriteStream;

    expect(writer.writeLine(stream, "hello")).toBe(false);
    expect(writer.isClosed()).toBe(true);
    expect(onBrokenPipe).toHaveBeenCalledTimes(1);

    onBrokenPipe.mockClear();
    expect(writer.writeLine(stream, "again")).toBe(false);
    expect(onBrokenPipe).toHaveBeenCalledTimes(0);
  });

  it("treats broken pipes from beforeWrite as closed", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const onBrokenPipe = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const writer = createSafeStreamWriter({
      onBrokenPipe,
      beforeWrite: () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
        const err = new Error("EIO") as NodeJS.ErrnoException;
        err.code = "EIO";
        throw err;
      },
    });
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const stream = { write: vi.fn(() => true) } as unknown as NodeJS.WriteStream;

    expect(writer.write(stream, "hi")).toBe(false);
    expect(writer.isClosed()).toBe(true);
    expect(onBrokenPipe).toHaveBeenCalledTimes(1);
  });
});
