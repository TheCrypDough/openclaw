/*
 * AUTO ANNOTATION
 * File: src/plugins/logger.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it, vi } from "vitest";
import { createPluginLoaderLogger } from "./logger.js";

describe("plugins/logger", () => {
  it("forwards logger methods", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const info = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const warn = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const error = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const debug = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const logger = createPluginLoaderLogger({ info, warn, error, debug });

    logger.info("i");
    logger.warn("w");
    logger.error("e");
    logger.debug?.("d");

    expect(info).toHaveBeenCalledWith("i");
    expect(warn).toHaveBeenCalledWith("w");
    expect(error).toHaveBeenCalledWith("e");
    expect(debug).toHaveBeenCalledWith("d");
  });
});
