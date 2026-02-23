/*
 * AUTO ANNOTATION
 * File: src/tui/tui-overlays.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import type { Component } from "@mariozechner/pi-tui";
import { describe, expect, it, vi } from "vitest";
import { createOverlayHandlers } from "./tui-overlays.js";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
class DummyComponent implements Component {
  render() {
    return ["dummy"];
  }

  invalidate() {}
}

describe("createOverlayHandlers", () => {
  it("routes overlays through the TUI overlay stack", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const showOverlay = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const hideOverlay = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const setFocus = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let open = false;

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const host = {
      showOverlay: (component: Component) => {
        open = true;
        showOverlay(component);
      },
      hideOverlay: () => {
        open = false;
        hideOverlay();
      },
      hasOverlay: () => open,
      setFocus,
    };

    const { openOverlay, closeOverlay } = createOverlayHandlers(
      host as unknown as Parameters<typeof createOverlayHandlers>[0],
      new DummyComponent(),
    );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const overlay = new DummyComponent();

    openOverlay(overlay);
    expect(showOverlay).toHaveBeenCalledWith(overlay);

    closeOverlay();
    expect(hideOverlay).toHaveBeenCalledTimes(1);
    expect(setFocus).not.toHaveBeenCalled();
  });

  it("restores focus when closing without an overlay", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const setFocus = vi.fn();
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const host = {
      showOverlay: vi.fn(),
      hideOverlay: vi.fn(),
      hasOverlay: () => false,
      setFocus,
    };
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const fallback = new DummyComponent();

    const { closeOverlay } = createOverlayHandlers(host, fallback);
    closeOverlay();

    expect(setFocus).toHaveBeenCalledWith(fallback);
  });
});
